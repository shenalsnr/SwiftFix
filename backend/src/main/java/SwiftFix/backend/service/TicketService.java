package SwiftFix.backend.service;

import SwiftFix.backend.dto.ticket.*;
import SwiftFix.backend.enums.TicketStatus;
import SwiftFix.backend.exception.BusinessRuleException;
import SwiftFix.backend.exception.ResourceNotFoundException;
import SwiftFix.backend.model.Ticket;
import SwiftFix.backend.model.TicketAttachment;
import SwiftFix.backend.model.TicketComment;
import SwiftFix.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    private static final int MAX_ATTACHMENTS = 3;
    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
    private static final Path TICKET_UPLOAD_DIR = Paths.get("uploads", "tickets");

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @Transactional
    public TicketResponse create(TicketCreateRequest request) {
        return create(request, List.of());
    }

    @Transactional
    public TicketResponse create(TicketCreateRequest request, List<MultipartFile> files) {
        Ticket ticket = new Ticket();
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setSubject(trimRequired(request.getSubject(), "subject"));
        ticket.setDescription(trimRequired(request.getMessage(), "message"));
        ticket.setPriority(normalizePriority(request.getPriority()));
        ticket.setReporterName(trimRequired(request.getName(), "name"));
        ticket.setReporterEmail(trimRequired(request.getEmail(), "email").toLowerCase());
        ticket.setRegNo(trimRequired(request.getRegNo(), "regNo"));
        ticket.setContactNo(trimRequired(request.getContactNo(), "contactNo"));
        ticket.setRequestTitle(trimRequired(request.getRequestTitle(), "requestTitle"));
        ticket.setCampus(trimRequired(request.getCampus(), "campus"));
        ticket.setUserId(trimRequired(request.getUserId(), "userId"));
        ticket.setResourceId(request.getResourceId());
        ticket.setLocation(trimOrNull(request.getLocation()));

        List<MultipartFile> safeFiles = files == null ? List.of() : files;
        if (safeFiles.size() > MAX_ATTACHMENTS) {
            throw new BusinessRuleException("You can upload up to 3 image attachments only");
        }

        ensureUploadDirExists();

        for (MultipartFile file : safeFiles) {
            if (file == null || file.isEmpty()) {
                continue;
            }
            validateAttachment(file);

            String original = sanitizeFileName(file.getOriginalFilename());
            String extension = getExtension(original);
            String storedName = UUID.randomUUID() + extension;

            Path target = TICKET_UPLOAD_DIR.resolve(storedName).normalize();
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, target, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                throw new BusinessRuleException("Failed to store attachment: " + original);
            }

            TicketAttachment attachment = new TicketAttachment();
            attachment.setOriginalFilename(original);
            attachment.setStoredFilename(storedName);
            attachment.setContentType(file.getContentType());
            attachment.setSize(file.getSize());
            ticket.addAttachment(attachment);
        }

        Ticket saved = ticketRepository.save(ticket);
        return TicketResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> findAll() {
        return ticketRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(TicketResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> findByUserId(String userId) {
        String cleanUserId = trimRequired(userId, "userId");
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(cleanUserId)
                .stream()
                .map(TicketResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public TicketResponse findById(Long id) {
        return TicketResponse.fromEntity(getTicketOrThrow(id));
    }

    @Transactional
    public TicketResponse updateStatus(Long id, TicketStatusUpdateRequest body) {
        Ticket ticket = getTicketOrThrow(id);

        TicketStatus next = body.getStatus();
        TicketStatus current = ticket.getStatus();

        if (next == null) {
            throw new BusinessRuleException("status is required");
        }

        if (current == TicketStatus.CLOSED || current == TicketStatus.REJECTED) {
            throw new BusinessRuleException("Closed or rejected tickets cannot be changed");
        }

        if (next == TicketStatus.REJECTED) {
            String rejectionReason = trimRequired(body.getRejectionReason(), "rejectionReason");
            ticket.setStatus(TicketStatus.REJECTED);
            ticket.setRejectionReason(rejectionReason);

            if (body.getAdminReply() != null && !body.getAdminReply().isBlank()) {
                ticket.setAdminReply(body.getAdminReply().trim());
                ticket.setRepliedAt(LocalDateTime.now());
            }

            return TicketResponse.fromEntity(ticketRepository.save(ticket));
        }

        if (!isValidTransition(current, next)) {
            throw new BusinessRuleException("Invalid status transition from " + current + " to " + next);
        }

        ticket.setStatus(next);

        if (body.getAdminReply() != null && !body.getAdminReply().isBlank()) {
            ticket.setAdminReply(body.getAdminReply().trim());
            ticket.setRepliedAt(LocalDateTime.now());
        }

        if (next != TicketStatus.REJECTED) {
            ticket.setRejectionReason(null);
        }

        Ticket saved = ticketRepository.save(ticket);
        return TicketResponse.fromEntity(saved);
    }

    @Transactional
    public TicketResponse assignTechnician(Long id, TicketAssignRequest body) {
        Ticket ticket = getTicketOrThrow(id);

        if (ticket.getStatus() == TicketStatus.CLOSED || ticket.getStatus() == TicketStatus.REJECTED) {
            throw new BusinessRuleException("Cannot assign technician to a closed or rejected ticket");
        }

        ticket.setTechnicianId(trimRequired(body.getTechnicianId(), "technicianId"));

        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }

        Ticket saved = ticketRepository.save(ticket);
        return TicketResponse.fromEntity(saved);
    }

    @Transactional
    public TicketResponse addResolutionNotes(Long id, TicketResolutionPatchRequest body) {
        Ticket ticket = getTicketOrThrow(id);

        if (ticket.getStatus() == TicketStatus.CLOSED || ticket.getStatus() == TicketStatus.REJECTED) {
            throw new BusinessRuleException("Cannot update resolution notes on a closed or rejected ticket");
        }

        ticket.setResolutionNotes(trimRequired(body.getResolutionNotes(), "resolutionNotes"));

        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }

        Ticket saved = ticketRepository.save(ticket);
        return TicketResponse.fromEntity(saved);
    }

    @Transactional
    public TicketResponse addComment(Long ticketId, TicketCommentCreateRequest body) {
        Ticket ticket = getTicketOrThrow(ticketId);

        TicketComment comment = new TicketComment();
        comment.setAuthorId(trimRequired(body.getAuthorId(), "authorId"));
        comment.setAuthorName(trimRequired(body.getAuthorName(), "authorName"));
        comment.setAuthorRole(normalizeRole(body.getAuthorRole()));
        comment.setMessage(trimRequired(body.getMessage(), "message"));

        ticket.addComment(comment);
        Ticket saved = ticketRepository.save(ticket);
        return TicketResponse.fromEntity(saved);
    }

    @Transactional
    public TicketResponse updateComment(Long ticketId, Long commentId, TicketCommentUpdateRequest body) {
        Ticket ticket = getTicketOrThrow(ticketId);
        TicketComment comment = getCommentOrThrow(ticket, commentId);

        String editorId = trimRequired(body.getEditorId(), "editorId");
        String editorRole = normalizeRole(body.getEditorRole());

        if (!canModifyComment(comment, editorId, editorRole)) {
            throw new BusinessRuleException("You can edit only your own comment unless you are an admin");
        }

        comment.setMessage(trimRequired(body.getMessage(), "message"));

        Ticket saved = ticketRepository.save(ticket);
        return TicketResponse.fromEntity(saved);
    }

    @Transactional
    public TicketResponse deleteComment(Long ticketId, Long commentId, String actorId, String actorRole) {
        Ticket ticket = getTicketOrThrow(ticketId);
        TicketComment comment = getCommentOrThrow(ticket, commentId);

        String cleanActorId = trimRequired(actorId, "actorId");
        String cleanActorRole = normalizeRole(actorRole);

        if (!canModifyComment(comment, cleanActorId, cleanActorRole)) {
            throw new BusinessRuleException("You can delete only your own comment unless you are an admin");
        }

        ticket.removeComment(comment);
        Ticket saved = ticketRepository.save(ticket);
        return TicketResponse.fromEntity(saved);
    }

    @Transactional
    public void deleteById(Long id) {
        Ticket ticket = getTicketOrThrow(id);

        for (TicketAttachment attachment : ticket.getAttachments()) {
            deletePhysicalFileQuietly(attachment.getStoredFilename());
        }

        ticketRepository.delete(ticket);
    }

    private Ticket getTicketOrThrow(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    private TicketComment getCommentOrThrow(Ticket ticket, Long commentId) {
        return ticket.getComments()
                .stream()
                .filter(comment -> comment.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
    }

    private boolean canModifyComment(TicketComment comment, String actorId, String actorRole) {
        return "ADMIN".equalsIgnoreCase(actorRole) || comment.getAuthorId().equals(actorId);
    }

    private boolean isValidTransition(TicketStatus current, TicketStatus next) {
        return switch (current) {
            case OPEN -> next == TicketStatus.IN_PROGRESS || next == TicketStatus.RESOLVED;
            case IN_PROGRESS -> next == TicketStatus.RESOLVED;
            case RESOLVED -> next == TicketStatus.CLOSED;
            case CLOSED, REJECTED -> false;
        };
    }

    private void validateAttachment(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BusinessRuleException("Each attachment must be 5MB or smaller");
        }

        String contentType = file.getContentType();
        String name = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();

        boolean imageContentType = contentType != null && contentType.startsWith("image/");
        boolean imageExtension =
                name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") ||
                name.endsWith(".gif") || name.endsWith(".webp");

        if (!imageContentType && !imageExtension) {
            throw new BusinessRuleException("Only image files are allowed");
        }
    }

    private void ensureUploadDirExists() {
        try {
            Files.createDirectories(TICKET_UPLOAD_DIR);
        } catch (IOException e) {
            throw new BusinessRuleException("Could not create ticket upload folder");
        }
    }

    private void deletePhysicalFileQuietly(String storedFilename) {
        if (storedFilename == null || storedFilename.isBlank()) {
            return;
        }
        try {
            Files.deleteIfExists(TICKET_UPLOAD_DIR.resolve(storedFilename));
        } catch (IOException ignored) {
        }
    }

    private String normalizePriority(String raw) {
        if (raw == null || raw.isBlank()) {
            return "MEDIUM";
        }

        String value = raw.trim().toUpperCase();
        if (!value.equals("LOW") && !value.equals("MEDIUM") && !value.equals("HIGH")) {
            throw new BusinessRuleException("priority must be LOW, MEDIUM, or HIGH");
        }
        return value;
    }

    private String normalizeRole(String raw) {
        String value = trimRequired(raw, "role").toUpperCase();
        if (!value.equals("USER") && !value.equals("ADMIN")) {
            throw new BusinessRuleException("role must be USER or ADMIN");
        }
        return value;
    }

    private String trimRequired(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new BusinessRuleException(fieldName + " is required");
        }
        return value.trim();
    }

    private String trimOrNull(String value) {
        if (value == null) {
            return null;
        }
        String clean = value.trim();
        return clean.isEmpty() ? null : clean;
    }

    private String sanitizeFileName(String value) {
        if (value == null || value.isBlank()) {
            return "attachment";
        }
        return Paths.get(value).getFileName().toString().replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private String getExtension(String fileName) {
        int index = fileName.lastIndexOf('.');
        return index >= 0 ? fileName.substring(index) : "";
    }
}