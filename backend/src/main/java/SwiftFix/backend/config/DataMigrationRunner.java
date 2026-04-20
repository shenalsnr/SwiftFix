package SwiftFix.backend.config;

import SwiftFix.backend.repository.AdminRepository;
import SwiftFix.backend.model.Admin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataMigrationRunner implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            int updatedRows = jdbcTemplate.update("UPDATE bookings SET status = 'CONFIRMED' WHERE status = 'APPROVED'");
            if (updatedRows > 0) {
                System.out.println("Data Migration: Migrated " + updatedRows + " bookings from APPROVED to CONFIRMED.");
            }
        } catch (Exception e) {
            System.err.println("Data Migration failed or not needed: " + e.getMessage());
        }

        try {
            if (!adminRepository.existsByEmail("admin123@gmail.com")) {
                Admin admin = Admin.builder()
                        .email("admin123@gmail.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role("ADMIN")
                        .build();

                adminRepository.save(admin);
                System.out.println("✅ Data Migration: Seeded default Admin user.");
            }
        } catch (Exception e) {
            System.err.println("Admin Database Seed failed: " + e.getMessage());
        }
    }
}
