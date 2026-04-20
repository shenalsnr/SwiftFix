package SwiftFix.backend.dto;

import SwiftFix.backend.model.User;
import SwiftFix.backend.model.NotificationPreference;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String fullName;
    private String studentId;
    private String phoneNumber;
    private String address;
    private String faculty; // Simple String
    private String email;
    private String profilePhotoPath;
    private String role;
    private NotificationPreferenceDTO notificationPreferences;

    public static UserDTO fromUser(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .studentId(user.getStudentId())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .faculty(user.getFaculty())
                .email(user.getEmail())
                .profilePhotoPath(user.getProfilePhotoPath())
                .role(user.getRole())
                .build();
    }

    public static UserDTO fromUserWithNotifications(User user, NotificationPreference notificationPreference) {
        return UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .studentId(user.getStudentId())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .faculty(user.getFaculty())
                .email(user.getEmail())
                .profilePhotoPath(user.getProfilePhotoPath())
                .role(user.getRole())
                .notificationPreferences(notificationPreference != null ? 
                    NotificationPreferenceDTO.fromNotificationPreference(notificationPreference) : null)
                .build();
    }
}
