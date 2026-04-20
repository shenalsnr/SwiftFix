package SwiftFix.backend.controller;

import SwiftFix.backend.dto.ticket.*;
import SwiftFix.backend.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Maintenance & Incident Ticketing API (Module C).
 * Prefix {@code /api/tickets} keeps resources separate from other controllers.
 */
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    /** POST — create ticket (201 Created). */
    @PostMapping
    public ResponseEntity<TicketResponse> create(@Valid @RequestBody TicketCreateRequest request) {
        TicketResponse created = ticketService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /** GET — list all tickets (admin / staff views). */
    @GetMapping
    public ResponseEntity<List<TicketResponse>> listAll() {
        return ResponseEntity.ok(ticketService.findAll());
    }

    /** GET — tickets raised by a specific user ("my tickets"). Must be before /{id}. */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketResponse>> listForUser(@PathVariable String userId) {
        return ResponseEntity.ok(ticketService.findByUserId(userId));
    }

    /**
     * GET — single ticket.
     * {@code acknowledge=true} (admin): first open stores a default message visible to the submitter.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getById(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean acknowledge) {
        return ResponseEntity.ok(ticketService.findById(id, acknowledge));
    }

    /**
     * PUT — advance workflow (OPEN → IN_PROGRESS → RESOLVED → CLOSED) or reject with reason.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TicketResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody TicketStatusUpdateRequest body) {
        return ResponseEntity.ok(ticketService.updateStatus(id, body));
    }

    /** PUT — assign technician. */
    @PutMapping("/{id}/assign")
    public ResponseEntity<TicketResponse> assign(
            @PathVariable Long id,
            @Valid @RequestBody TicketAssignRequest body) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, body));
    }

    /** PATCH — append / set resolution notes (technician update). */
    @PatchMapping("/{id}/resolution")
    public ResponseEntity<TicketResponse> patchResolution(
            @PathVariable Long id,
            @Valid @RequestBody TicketResolutionPatchRequest body) {
        return ResponseEntity.ok(ticketService.addResolutionNotes(id, body));
    }

    /** DELETE — remove ticket (204 No Content). */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ticketService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
