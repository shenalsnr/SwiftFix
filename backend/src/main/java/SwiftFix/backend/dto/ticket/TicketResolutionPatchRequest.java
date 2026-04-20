package SwiftFix.backend.dto.ticket;

/**
 * Body for PATCH /api/tickets/{id}/resolution — technician / staff resolution notes.
 */
public class TicketResolutionPatchRequest {

    private String resolutionNotes;

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }
}
