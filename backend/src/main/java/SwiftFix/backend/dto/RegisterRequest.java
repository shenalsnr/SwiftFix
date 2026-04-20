package SwiftFix.backend.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String fullName;
    private String studentId;
    private String email;
    private String phoneNumber;
    private String address;
    private String faculty; // Simple String (e.g., "Faculty of Computing")
    private String password;
    private String confirmPassword;
    private MultipartFile profilePhoto; // Profile photo upload
}
