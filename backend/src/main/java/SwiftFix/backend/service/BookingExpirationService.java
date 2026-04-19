package SwiftFix.backend.service;

import SwiftFix.backend.repository.BookingRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Background service that automatically expires admin-confirmed (APPROVED) bookings
 * once the current date and time have passed the booking's end time.
 * Runs every minute. Expired bookings are NOT deleted — they remain in the
 * database for history, tracking, and reference.
 */
@Service
public class BookingExpirationService {

    @Autowired
    private BookingRepository bookingRepository;

    // Runs every minute at the top of the minute
    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void expireConfirmedBookings() {
        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();

        int expiredCount = bookingRepository.expirePastBookings(currentDate, currentTime);

        if (expiredCount > 0) {
            System.out.println("[BookingExpirationService] Auto-expired " + expiredCount
                    + " confirmed booking(s) at " + currentDate + " " + currentTime);
        }
    }
}
