package SwiftFix.backend.dto.ticket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TicketResolutionPatchRequest {

    @NotBlank(message = "resolutionNotes is required")
    @Size(max = 2000, message = "resolutionNotes is too long")
    private String resolutionNotes;

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }
}