package SwiftFix.backend.dto.ticket;

/** Body for PUT /api/tickets/{id}/assign — typically a technician user id or staff code. */
public class TicketAssignRequest {

    private String technicianId;

    public String getTechnicianId() {
        return technicianId;
    }

    public void setTechnicianId(String technicianId) {
        this.technicianId = technicianId;
    }
}
