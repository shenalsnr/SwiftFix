package SwiftFix.backend.controller;

import SwiftFix.backend.dto.ticket.*;
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

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TicketResponse> createJson(@Valid @RequestBody TicketCreateRequest request) {
        TicketResponse created = ticketService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TicketResponse> createMultipart(
            @Valid @RequestPart("ticket") TicketCreateRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        TicketResponse created = ticketService.create(request, files);
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
        // acknowledge kept only for compatibility with old frontend calls
        return ResponseEntity.ok(ticketService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TicketResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody TicketStatusUpdateRequest body
    ) {
        return ResponseEntity.ok(ticketService.updateStatus(id, body));
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
        return ResponseEntity.ok(ticketService.addResolutionNotes(id, body));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketResponse> addComment(
            @PathVariable Long id,
            @Valid @RequestBody TicketCommentCreateRequest body
    ) {
        return ResponseEntity.ok(ticketService.addComment(id, body));
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
}