package SwiftFix.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DataMigrationRunner implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

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
    }
}
