package SwiftFix.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequest {
    // User details
    private String fullName;
    private String studentId;
    private String phoneNumber;
    private String address;
    private String faculty;
    private String profilePhotoPath;

    // Notification preferences
    private Boolean emailNotifications;
    private Boolean bookingUpdates;
    private Boolean resourceAvailability;
    private Boolean systemAlerts;
}
