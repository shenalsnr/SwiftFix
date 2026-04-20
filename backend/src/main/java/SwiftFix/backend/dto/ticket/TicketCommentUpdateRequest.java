package SwiftFix.backend.dto.ticket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TicketCommentUpdateRequest {

    @NotBlank(message = "editorId is required")
    @Size(max = 64, message = "editorId is too long")
    private String editorId;

    @NotBlank(message = "editorRole is required")
    @Size(max = 20, message = "editorRole is too long")
    private String editorRole;

    @NotBlank(message = "message is required")
    @Size(max = 2000, message = "message is too long")
    private String message;

    public String getEditorId() {
        return editorId;
    }

    public String getEditorRole() {
        return editorRole;
    }

    public String getMessage() {
        return message;
    }

    public void setEditorId(String editorId) {
        this.editorId = editorId;
    }

    public void setEditorRole(String editorRole) {
        this.editorRole = editorRole;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}