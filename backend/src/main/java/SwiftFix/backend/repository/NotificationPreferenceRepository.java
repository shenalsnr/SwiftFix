package SwiftFix.backend.repository;

import SwiftFix.backend.model.NotificationPreference;
import SwiftFix.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreference, Long> {
    Optional<NotificationPreference> findByUser(User user);
    Optional<NotificationPreference> findByUserId(Long userId);
}
