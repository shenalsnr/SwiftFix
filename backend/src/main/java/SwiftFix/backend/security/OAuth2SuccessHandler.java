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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    @Value("${oauth2.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {

        // Extract OAuth2User from authentication
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        // Extract email and name from OAuth2User attributes
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        System.out.println("OAuth2 Success - Email: " + email + ", Name: " + name);

        if (email == null || email.isEmpty()) {
            response.sendRedirect(frontendUrl + "/auth?error=oauth_email_missing");
            return;
        }

        // Find existing user or create a new one
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(email)
                    .fullName(name != null ? name : email.split("@")[0])
                    .studentId("OAUTH2_" + System.currentTimeMillis())
                    .phoneNumber("")
                    .address("")
                    .faculty("")
                    .password("")
                    .role("USER")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            User saved = userRepository.save(newUser);
            System.out.println("✅ New OAuth2 user created: " + email);
            return saved;
        });

        System.out.println("✅ OAuth2 user authenticated: " + email + " (ID: " + user.getId() + ")");

        // Generate a JWT token so the frontend can authenticate API calls
        String token = jwtProvider.generateToken(
                user.getId(), user.getEmail(), user.getRole(), user.getFullName());

        // Pass token and user info as URL params to the frontend OAuth callback page
        String encodedEmail    = URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8);
        String encodedFullName = URLEncoder.encode(user.getFullName() != null ? user.getFullName() : "", StandardCharsets.UTF_8);

        String redirectUrl = frontendUrl + "/oauth-callback"
                + "?token="    + token
                + "&userId="   + user.getId()
                + "&role="     + user.getRole()
                + "&email="    + encodedEmail
                + "&fullName=" + encodedFullName;

        response.sendRedirect(redirectUrl);
    }
}
