package SwiftFix.backend.dto.ticket;

import SwiftFix.backend.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TicketStatusUpdateRequest {

    @NotNull(message = "status is required")
    private TicketStatus status;

    @Size(max = 1000, message = "rejectionReason is too long")
    private String rejectionReason;

    @Size(max = 2000, message = "adminReply is too long")
    private String adminReply;

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getAdminReply() {
        return adminReply;
    }

    public void setAdminReply(String adminReply) {
        this.adminReply = adminReply;
    }
}