package SwiftFix.backend.dto.ticket;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Create ticket payload. Faculty / request-type fields removed per product requirements.
 * {@code requestTitle} is the routed queue (e.g. Technical Support). Alias {@code department} for older clients.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class TicketCreateRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 120)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 160)
    private String email;

    @NotBlank(message = "Registration number is required")
    @Size(max = 64)
    private String regNo;

    @NotBlank(message = "Contact number is required")
    @Size(max = 32)
    private String contactNo;

    @NotBlank(message = "Request title is required")
    @Size(max = 120)
    @JsonAlias("department")
    private String requestTitle;

    @NotBlank(message = "Subject is required")
    @Size(max = 200)
    private String subject;

    @NotBlank(message = "Campus is required")
    @Size(max = 120)
    private String campus;

    @NotBlank(message = "Description is required")
    @Size(max = 4000)
    private String message;

    @Size(max = 16)
    private String priority;

    @NotBlank(message = "User id is required")
    @Size(max = 64)
    private String userId;

    private Long resourceId;

    @Size(max = 200)
    private String location;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRegNo() {
        return regNo;
    }

    public void setRegNo(String regNo) {
        this.regNo = regNo;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getRequestTitle() {
        return requestTitle;
    }

    public void setRequestTitle(String requestTitle) {
        this.requestTitle = requestTitle;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getCampus() {
        return campus;
    }

    public void setCampus(String campus) {
        this.campus = campus;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
