package SwiftFix.backend.service;

import SwiftFix.backend.dto.ticket.*;
import SwiftFix.backend.enums.TicketStatus;
import SwiftFix.backend.exception.BusinessRuleException;
import SwiftFix.backend.exception.ResourceNotFoundException;
import SwiftFix.backend.model.Ticket;
import SwiftFix.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    private static final String TECHNICAL_SUPPORT = "Technical Support";

    /** Shown to the submitter the first time an admin opens the ticket for review. */
    private static final String DEFAULT_ADMIN_ACK =
            "Your request has been received and is being reviewed by the administration team.";

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @Transactional
    public TicketResponse create(TicketCreateRequest request) {
        Ticket t = new Ticket();
        t.setStatus(TicketStatus.OPEN);
        t.setSubject(request.getSubject().trim());
        t.setDescription(request.getMessage().trim());
        t.setPriority(normalizePriority(request.getPriority()));
        t.setReporterName(request.getName().trim());
        t.setReporterEmail(request.getEmail().trim().toLowerCase());
        t.setRegNo(request.getRegNo().trim());
        t.setContactNo(request.getContactNo().trim());
        t.setRequestTitle(request.getRequestTitle().trim());
        t.setCampus(request.getCampus().trim());
        t.setUserId(request.getUserId().trim());
        t.setResourceId(request.getResourceId());
        t.setLocation(trimOrNull(request.getLocation()));
        Ticket saved = ticketRepository.save(t);
        return TicketResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> findAll() {
        return ticketRepository.findAll().stream()
                .map(TicketResponse::fromEntity)
                .toList();
    }

    /**
     * @param acknowledgeWhen true (admin console), persist a default acknowledgement message once
     *                        so the submitter sees it under "My tickets".
     */
    @Transactional
    public TicketResponse findById(Long id, boolean acknowledgeWhen) {
        Ticket t = getTicketOrThrow(id);
        if (acknowledgeWhen && (t.getAdminReply() == null || t.getAdminReply().isBlank())) {
            t.setAdminReply(DEFAULT_ADMIN_ACK);
            t.setRepliedAt(LocalDateTime.now());
            t = ticketRepository.save(t);
        }
        return TicketResponse.fromEntity(t);
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> findByUserId(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new BusinessRuleException("userId is required");
        }
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(userId.trim()).stream()
                .map(TicketResponse::fromEntity)
                .toList();
    }

    @Transactional
    public TicketResponse updateStatus(Long id, TicketStatusUpdateRequest body) {
        Ticket ticket = getTicketOrThrow(id);
        TicketStatus current = ticket.getStatus();
        TicketStatus next = body.getStatus();
        String title = ticket.getRequestTitle();

        if (next == TicketStatus.REJECTED) {
            if (body.getRejectionReason() == null || body.getRejectionReason().isBlank()) {
                throw new BusinessRuleException("rejectionReason is required when status is REJECTED");
            }
            if (current != TicketStatus.OPEN && current != TicketStatus.IN_PROGRESS) {
                throw new BusinessRuleException("Tickets can only be rejected from OPEN or IN_PROGRESS");
            }
            ticket.setStatus(TicketStatus.REJECTED);
            ticket.setRejectionReason(body.getRejectionReason().trim());
            return TicketResponse.fromEntity(ticketRepository.save(ticket));
        }

        assertTransitionForTitle(title, current, next);
        ticket.setStatus(next);
        return TicketResponse.fromEntity(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketResponse assignTechnician(Long id, TicketAssignRequest body) {
        Ticket ticket = getTicketOrThrow(id);
        if (!isTechnicalSupport(ticket.getRequestTitle())) {
            throw new BusinessRuleException(
                    "Technician assignment applies only to Technical Support requests."
            );
        }
        if (ticket.getStatus() != TicketStatus.IN_PROGRESS) {
            throw new BusinessRuleException(
                    "Assign a technician only while the ticket is In progress (use Start first)."
            );
        }
        ticket.setTechnicianId(body.getTechnicianId().trim());
        return TicketResponse.fromEntity(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketResponse addResolutionNotes(Long id, TicketResolutionPatchRequest body) {
        Ticket ticket = getTicketOrThrow(id);
        if (ticket.getStatus() == TicketStatus.CLOSED || ticket.getStatus() == TicketStatus.REJECTED) {
            throw new BusinessRuleException("Cannot update resolution notes on a closed or rejected ticket");
        }
        ticket.setResolutionNotes(body.getResolutionNotes().trim());
        return TicketResponse.fromEntity(ticketRepository.save(ticket));
    }

    @Transactional
    public void deleteById(Long id) {
        Ticket ticket = getTicketOrThrow(id);
        ticketRepository.delete(ticket);
    }

    private Ticket getTicketOrThrow(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    /**
     * Technical Support: OPEN → IN_PROGRESS → RESOLVED → CLOSED (field workflow + technician).
     * Other titles: OPEN → RESOLVED → CLOSED (no in-progress / no technician step).
     */
    private void assertTransitionForTitle(String requestTitle, TicketStatus current, TicketStatus next) {
        boolean ok;
        if (isTechnicalSupport(requestTitle)) {
            ok = switch (current) {
                case OPEN -> next == TicketStatus.IN_PROGRESS;
                case IN_PROGRESS -> next == TicketStatus.RESOLVED;
                case RESOLVED -> next == TicketStatus.CLOSED;
                case CLOSED, REJECTED -> false;
            };
        } else {
            ok = switch (current) {
                case OPEN -> next == TicketStatus.RESOLVED;
                case RESOLVED -> next == TicketStatus.CLOSED;
                case IN_PROGRESS, CLOSED, REJECTED -> false;
            };
        }
        if (!ok) {
            throw new BusinessRuleException(
                    "Invalid status transition from " + current + " to " + next
                            + " for request title \"" + requestTitle + "\""
            );
        }
    }

    private static boolean isTechnicalSupport(String requestTitle) {
        return requestTitle != null && TECHNICAL_SUPPORT.equalsIgnoreCase(requestTitle.trim());
    }

    private static String normalizePriority(String raw) {
        if (raw == null || raw.isBlank()) {
            return "MEDIUM";
        }
        String p = raw.trim().toUpperCase();
        if (!p.equals("LOW") && !p.equals("MEDIUM") && !p.equals("HIGH")) {
            throw new BusinessRuleException("priority must be LOW, MEDIUM, or HIGH");
        }
        return p;
    }

    private static String trimOrNull(String s) {
        if (s == null) {
            return null;
        }
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }
}
