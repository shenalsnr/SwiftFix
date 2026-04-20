package SwiftFix.backend.service;

import SwiftFix.backend.dto.UpdateUserRequest;
import SwiftFix.backend.dto.UpdateProfileRequest;
import SwiftFix.backend.dto.UserDTO;
import SwiftFix.backend.exception.ResourceNotFoundException;
import SwiftFix.backend.model.User;
import SwiftFix.backend.model.NotificationPreference;
import SwiftFix.backend.repository.UserRepository;
import SwiftFix.backend.repository.NotificationPreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final NotificationPreferenceRepository notificationPreferenceRepository;

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserDTO.fromUser(user);
    }

    /**
     * Get current user by ID with notification preferences
     * @param id the user id
     * @return UserDTO with notification preferences
     */
    public UserDTO getCurrentUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        NotificationPreference notificationPreference = notificationPreferenceRepository.findByUserId(id).orElse(null);
        return UserDTO.fromUserWithNotifications(user, notificationPreference);
    }

    /**
     * Find user by email
     * @param email the email address
     * @return Optional containing the user if found
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDTO::fromUser)
                .toList();
    }

    public UserDTO updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getFaculty() != null) {
            user.setFaculty(request.getFaculty());
        }
        if (request.getProfilePhotoPath() != null) {
            user.setProfilePhotoPath(request.getProfilePhotoPath());
        }

        User updatedUser = userRepository.save(user);
        return UserDTO.fromUser(updatedUser);
    }

    /**
     * Update user profile and notification preferences
     * @param id the user id
     * @param request the update request containing user details and notification preferences
     * @return updated UserDTO with notification preferences
     */
    @Transactional
    public UserDTO updateUserProfile(Long id, UpdateProfileRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Update user details
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getFaculty() != null) {
            user.setFaculty(request.getFaculty());
        }
        if (request.getProfilePhotoPath() != null) {
            user.setProfilePhotoPath(request.getProfilePhotoPath());
        }
        if (request.getStudentId() != null && user.getStudentId() != null && user.getStudentId().startsWith("OAUTH2_")) {
            user.setStudentId(request.getStudentId());
        }

        User updatedUser = userRepository.save(user);

        // Update notification preferences
        NotificationPreference notificationPreference = notificationPreferenceRepository.findByUserId(id)
                .orElseGet(() -> NotificationPreference.builder()
                    .user(updatedUser)
                    .emailNotifications(true)
                    .bookingUpdates(true)
                    .resourceAvailability(true)
                    .systemAlerts(true)
                    .build());

        if (request.getEmailNotifications() != null) {
            notificationPreference.setEmailNotifications(request.getEmailNotifications());
        }
        if (request.getBookingUpdates() != null) {
            notificationPreference.setBookingUpdates(request.getBookingUpdates());
        }
        if (request.getResourceAvailability() != null) {
            notificationPreference.setResourceAvailability(request.getResourceAvailability());
        }
        if (request.getSystemAlerts() != null) {
            notificationPreference.setSystemAlerts(request.getSystemAlerts());
        }

        NotificationPreference savedNotificationPreference = notificationPreferenceRepository.save(notificationPreference);

        return UserDTO.fromUserWithNotifications(updatedUser, savedNotificationPreference);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }
}

