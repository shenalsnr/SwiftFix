package SwiftFix.backend.dto.ticket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TicketAssignRequest {

    @NotBlank(message = "technicianId is required")
    @Size(max = 64, message = "technicianId is too long")
    private String technicianId;

    public String getTechnicianId() {
        return technicianId;
    }

    public void setTechnicianId(String technicianId) {
        this.technicianId = technicianId;
    }
}