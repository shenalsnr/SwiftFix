package SwiftFix.backend.dto.ticket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TicketCommentCreateRequest {

    @NotBlank(message = "authorId is required")
    @Size(max = 64, message = "authorId is too long")
    private String authorId;

    @NotBlank(message = "authorName is required")
    @Size(max = 120, message = "authorName is too long")
    private String authorName;

    @NotBlank(message = "authorRole is required")
    @Size(max = 20, message = "authorRole is too long")
    private String authorRole;

    @NotBlank(message = "message is required")
    @Size(max = 2000, message = "message is too long")
    private String message;

    public String getAuthorId() {
        return authorId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public String getAuthorRole() {
        return authorRole;
    }

    public String getMessage() {
        return message;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public void setAuthorRole(String authorRole) {
        this.authorRole = authorRole;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}