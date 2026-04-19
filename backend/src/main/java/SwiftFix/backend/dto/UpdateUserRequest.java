package SwiftFix.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String fullName;
    private String phoneNumber;
    private String address;
    private String faculty; // Simple String
    private String profilePhotoPath;
}
