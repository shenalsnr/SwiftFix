package SwiftFix.backend.security;

import SwiftFix.backend.model.User;
import SwiftFix.backend.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserRepository userRepository;

    @Value("${oauth2.redirect-url:http://localhost:5173/student-catalogue}")
    private String redirectUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) 
            throws IOException, ServletException {
        
        // Extract OAuth2User from authentication
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        
        // Extract email and name from OAuth2User attributes
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        
        System.out.println("OAuth2 Success - Email: " + email + ", Name: " + name);
        
        if (email != null && !email.isEmpty()) {
            // Check if user already exists
            Optional<User> existingUser = userRepository.findByEmail(email);
            
            if (existingUser.isEmpty()) {
                // Create new user if doesn't exist
                User newUser = User.builder()
                        .email(email)
                        .fullName(name != null ? name : email.split("@")[0])
                        .studentId("OAUTH2_" + System.currentTimeMillis())  // Generate a unique student ID
                        .phoneNumber(null)  // OAuth2 doesn't provide phone - set to null instead of empty string
                        .address(null)      // OAuth2 doesn't provide address - set to null instead of empty string
                        .faculty(null)      // OAuth2 doesn't provide faculty - set to null instead of empty string
                        .password(null)     // OAuth2 users don't have passwords - set to null instead of empty string
                        .role("USER")
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                
                userRepository.save(newUser);
                System.out.println("✅ New OAuth2 user created: " + email);
            } else {
                System.out.println("✅ Existing user found: " + email);
            }
        }
        
        // Redirect to frontend student catalogue
        this.setDefaultTargetUrl(redirectUrl);
        super.onAuthenticationSuccess(request, response, authentication);
    }
}
