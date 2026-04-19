package SwiftFix.backend.service;

import SwiftFix.backend.dto.UpdateUserRequest;
import SwiftFix.backend.dto.UserDTO;
import SwiftFix.backend.exception.ResourceNotFoundException;
import SwiftFix.backend.model.User;
import SwiftFix.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserDTO.fromUser(user);
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

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }
}
