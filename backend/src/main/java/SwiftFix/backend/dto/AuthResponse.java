package SwiftFix.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
    private Long userId;
    private String email;
    private String fullName;
}
