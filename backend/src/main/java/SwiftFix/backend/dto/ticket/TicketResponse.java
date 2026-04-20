package SwiftFix.backend.dto.ticket;

import SwiftFix.backend.model.Ticket;
import SwiftFix.backend.model.TicketAttachment;
import SwiftFix.backend.model.TicketComment;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class TicketResponse {

    private Long id;
    private String status;
    private String subject;
    private String description;
    private String priority;
    private String reporterName;
    private String reporterEmail;
    private String regNo;
    private String contactNo;
    private String requestTitle;
    private String campus;
    private String userId;
    private String technicianId;
    private Long resourceId;
    private String location;
    private String resolutionNotes;
    private String rejectionReason;
    private String adminReply;
    private LocalDateTime repliedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommentDto> comments = new ArrayList<>();
    private List<AttachmentDto> attachments = new ArrayList<>();

    public static TicketResponse fromEntity(Ticket t) {
        TicketResponse r = new TicketResponse();
        r.setId(t.getId());
        r.setStatus(t.getStatus() != null ? t.getStatus().name() : null);
        r.setSubject(t.getSubject());
        r.setDescription(t.getDescription());
        r.setPriority(t.getPriority());
        r.setReporterName(t.getReporterName());
        r.setReporterEmail(t.getReporterEmail());
        r.setRegNo(t.getRegNo());
        r.setContactNo(t.getContactNo());
        r.setRequestTitle(t.getRequestTitle());
        r.setCampus(t.getCampus());
        r.setUserId(t.getUserId());
        r.setTechnicianId(t.getTechnicianId());
        r.setResourceId(t.getResourceId());
        r.setLocation(t.getLocation());
        r.setResolutionNotes(t.getResolutionNotes());
        r.setRejectionReason(t.getRejectionReason());
        r.setAdminReply(t.getAdminReply());
        r.setRepliedAt(t.getRepliedAt());
        r.setCreatedAt(t.getCreatedAt());
        r.setUpdatedAt(t.getUpdatedAt());

        if (t.getComments() != null) {
            List<CommentDto> commentDtos = new ArrayList<>();
            for (TicketComment comment : t.getComments()) {
                CommentDto dto = new CommentDto();
                dto.setId(comment.getId());
                dto.setAuthorId(comment.getAuthorId());
                dto.setAuthorName(comment.getAuthorName());
                dto.setAuthorRole(comment.getAuthorRole());
                dto.setMessage(comment.getMessage());
                dto.setCreatedAt(comment.getCreatedAt());
                dto.setUpdatedAt(comment.getUpdatedAt());
                commentDtos.add(dto);
            }
            r.setComments(commentDtos);
        }

        if (t.getAttachments() != null) {
            List<AttachmentDto> attachmentDtos = new ArrayList<>();
            for (TicketAttachment attachment : t.getAttachments()) {
                AttachmentDto dto = new AttachmentDto();
                dto.setId(attachment.getId());
                dto.setOriginalFilename(attachment.getOriginalFilename());
                dto.setStoredFilename(attachment.getStoredFilename());
                dto.setContentType(attachment.getContentType());
                dto.setSize(attachment.getSize());
                dto.setFileUrl("/uploads/tickets/" + attachment.getStoredFilename());
                dto.setCreatedAt(attachment.getCreatedAt());
                attachmentDtos.add(dto);
            }
            r.setAttachments(attachmentDtos);
        }

        return r;
    }

    public static class CommentDto {
        private Long id;
        private String authorId;
        private String authorName;
        private String authorRole;
        private String message;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Long getId() {
            return id;
        }

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

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public LocalDateTime getUpdatedAt() {
            return updatedAt;
        }

        public void setId(Long id) {
            this.id = id;
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

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        public void setUpdatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
        }
    }

    public static class AttachmentDto {
        private Long id;
        private String originalFilename;
        private String storedFilename;
        private String contentType;
        private Long size;
        private String fileUrl;
        private LocalDateTime createdAt;

        public Long getId() {
            return id;
        }

        public String getOriginalFilename() {
            return originalFilename;
        }

        public String getStoredFilename() {
            return storedFilename;
        }

        public String getContentType() {
            return contentType;
        }

        public Long getSize() {
            return size;
        }

        public String getFileUrl() {
            return fileUrl;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public void setOriginalFilename(String originalFilename) {
            this.originalFilename = originalFilename;
        }

        public void setStoredFilename(String storedFilename) {
            this.storedFilename = storedFilename;
        }

        public void setContentType(String contentType) {
            this.contentType = contentType;
        }

        public void setSize(Long size) {
            this.size = size;
        }

        public void setFileUrl(String fileUrl) {
            this.fileUrl = fileUrl;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }

    public Long getId() {
        return id;
    }

    public String getStatus() {
        return status;
    }

    public String getSubject() {
        return subject;
    }

    public String getDescription() {
        return description;
    }

    public String getPriority() {
        return priority;
    }

    public String getReporterName() {
        return reporterName;
    }

    public String getReporterEmail() {
        return reporterEmail;
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

    public String getCampus() {
        return campus;
    }

    public String getUserId() {
        return userId;
    }

    public String getTechnicianId() {
        return technicianId;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public String getLocation() {
        return location;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public String getAdminReply() {
        return adminReply;
    }

    public LocalDateTime getRepliedAt() {
        return repliedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public List<CommentDto> getComments() {
        return comments;
    }

    public List<AttachmentDto> getAttachments() {
        return attachments;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public void setReporterName(String reporterName) {
        this.reporterName = reporterName;
    }

    public void setReporterEmail(String reporterEmail) {
        this.reporterEmail = reporterEmail;
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

    public void setCampus(String campus) {
        this.campus = campus;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setTechnicianId(String technicianId) {
        this.technicianId = technicianId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public void setAdminReply(String adminReply) {
        this.adminReply = adminReply;
    }

    public void setRepliedAt(LocalDateTime repliedAt) {
        this.repliedAt = repliedAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setComments(List<CommentDto> comments) {
        this.comments = comments;
    }

    public void setAttachments(List<AttachmentDto> attachments) {
        this.attachments = attachments;
    }
}