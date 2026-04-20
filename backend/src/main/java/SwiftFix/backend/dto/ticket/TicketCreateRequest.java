package SwiftFix.backend.dto.ticket;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TicketCreateRequest {

    @NotBlank(message = "name is required")
    @Size(max = 120, message = "name is too long")
    private String name;

    @NotBlank(message = "email is required")
    @Email(message = "email must be valid")
    @Size(max = 160, message = "email is too long")
    private String email;

    @NotBlank(message = "regNo is required")
    @Size(max = 64, message = "regNo is too long")
    private String regNo;

    @NotBlank(message = "contactNo is required")
    @Size(max = 32, message = "contactNo is too long")
    private String contactNo;

    @NotBlank(message = "requestTitle is required")
    @Size(max = 120, message = "requestTitle is too long")
    @JsonAlias("department")
    private String requestTitle;

    @NotBlank(message = "subject is required")
    @Size(max = 200, message = "subject is too long")
    private String subject;

    @NotBlank(message = "campus is required")
    @Size(max = 120, message = "campus is too long")
    private String campus;

    @NotBlank(message = "message is required")
    @Size(max = 4000, message = "message is too long")
    private String message;

    @Size(max = 16, message = "priority is too long")
    private String priority;

    @NotBlank(message = "userId is required")
    @Size(max = 64, message = "userId is too long")
    private String userId;

    private Long resourceId;

    @Size(max = 200, message = "location is too long")
    private String location;

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRegNo() {
        return regNo;
    }

    public String getContactNo() {
        return contactNo;
    }

    public String getRequestTitle() {
        return requestTitle;
    }

    public String getSubject() {
        return subject;
    }

    public String getCampus() {
        return campus;
    }

    public String getMessage() {
        return message;
    }

    public String getPriority() {
        return priority;
    }

    public String getUserId() {
        return userId;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public String getLocation() {
        return location;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRegNo(String regNo) {
        this.regNo = regNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public void setRequestTitle(String requestTitle) {
        this.requestTitle = requestTitle;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public void setCampus(String campus) {
        this.campus = campus;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}