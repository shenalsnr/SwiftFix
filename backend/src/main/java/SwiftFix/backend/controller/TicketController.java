package SwiftFix.backend.controller;

import SwiftFix.backend.dto.ticket.*;
import SwiftFix.backend.service.NotificationService;
import SwiftFix.backend.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;
    private final NotificationService notificationService;

    public TicketController(TicketService ticketService, NotificationService notificationService) {
        this.ticketService = ticketService;
        this.notificationService = notificationService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TicketResponse> createJson(@Valid @RequestBody TicketCreateRequest request) {
        TicketResponse created = ticketService.create(request);
        notificationService.createNotification(
            created.getUserId(),
            "Your ticket #" + created.getId() + " has been submitted successfully. We'll review it shortly.",
            "TICKET_CREATED"
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TicketResponse> createMultipart(
            @Valid @RequestPart("ticket") TicketCreateRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        TicketResponse created = ticketService.create(request, files);
        notificationService.createNotification(
            created.getUserId(),
            "Your ticket #" + created.getId() + " has been submitted with attachments. We'll review it shortly.",
            "TICKET_CREATED"
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<TicketResponse>> listAll() {
        return ResponseEntity.ok(ticketService.findAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketResponse>> listForUser(@PathVariable String userId) {
        return ResponseEntity.ok(ticketService.findByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getById(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean acknowledge
    ) {
        return ResponseEntity.ok(ticketService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TicketResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody TicketStatusUpdateRequest body
    ) {
        TicketResponse updated = ticketService.updateStatus(id, body);
        String statusLabel = formatStatus(updated.getStatus());
        notificationService.createNotification(
            updated.getUserId(),
            "Your ticket #" + id + " status has been updated to: " + statusLabel + ".",
            "TICKET_STATUS_UPDATE"
        );
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<TicketResponse> assign(
            @PathVariable Long id,
            @Valid @RequestBody TicketAssignRequest body
    ) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, body));
    }

    @PatchMapping("/{id}/resolution")
    public ResponseEntity<TicketResponse> patchResolution(
            @PathVariable Long id,
            @Valid @RequestBody TicketResolutionPatchRequest body
    ) {
        TicketResponse updated = ticketService.addResolutionNotes(id, body);
        notificationService.createNotification(
            updated.getUserId(),
            "A resolution note has been added to your ticket #" + id + ". Please review it.",
            "TICKET_RESOLVED"
        );
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketResponse> addComment(
            @PathVariable Long id,
            @Valid @RequestBody TicketCommentCreateRequest body
    ) {
        TicketResponse updated = ticketService.addComment(id, body);
        // Only notify the ticket owner if the commenter is not the owner themselves
        boolean isAdminComment = "ADMIN".equalsIgnoreCase(body.getAuthorRole())
                || "TECHNICIAN".equalsIgnoreCase(body.getAuthorRole());
        if (isAdminComment) {
            notificationService.createNotification(
                updated.getUserId(),
                "An admin replied to your ticket #" + id + ": \"" + truncate(body.getMessage(), 80) + "\"",
                "TICKET_COMMENT"
            );
        }
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<TicketResponse> updateComment(
            @PathVariable Long ticketId,
            @PathVariable Long commentId,
            @Valid @RequestBody TicketCommentUpdateRequest body
    ) {
        return ResponseEntity.ok(ticketService.updateComment(ticketId, commentId, body));
    }

    @DeleteMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<TicketResponse> deleteComment(
            @PathVariable Long ticketId,
            @PathVariable Long commentId,
            @RequestParam String actorId,
            @RequestParam String actorRole
    ) {
        return ResponseEntity.ok(ticketService.deleteComment(ticketId, commentId, actorId, actorRole));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ticketService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private String formatStatus(String status) {
        if (status == null) return "Unknown";
        return switch (status) {
            case "OPEN"        -> "Open";
            case "IN_PROGRESS" -> "In Progress";
            case "RESOLVED"    -> "Resolved";
            case "CLOSED"      -> "Closed";
            case "REJECTED"    -> "Rejected";
            default            -> status;
        };
    }

    private String truncate(String text, int maxLen) {
        if (text == null) return "";
        return text.length() <= maxLen ? text : text.substring(0, maxLen) + "…";
    }
}