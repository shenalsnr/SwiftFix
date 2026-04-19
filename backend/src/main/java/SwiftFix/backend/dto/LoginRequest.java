package SwiftFix.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String emailOrId;
    private String password;
}
