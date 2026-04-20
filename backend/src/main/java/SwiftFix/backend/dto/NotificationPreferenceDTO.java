package SwiftFix.backend.dto;

import SwiftFix.backend.model.NotificationPreference;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationPreferenceDTO {
    private Long id;
    private Boolean emailNotifications;
    private Boolean bookingUpdates;
    private Boolean resourceAvailability;
    private Boolean systemAlerts;

    public static NotificationPreferenceDTO fromNotificationPreference(NotificationPreference notificationPreference) {
        return NotificationPreferenceDTO.builder()
                .id(notificationPreference.getId())
                .emailNotifications(notificationPreference.getEmailNotifications())
                .bookingUpdates(notificationPreference.getBookingUpdates())
                .resourceAvailability(notificationPreference.getResourceAvailability())
                .systemAlerts(notificationPreference.getSystemAlerts())
                .build();
    }
}
