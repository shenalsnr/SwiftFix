package SwiftFix.backend.service;

import SwiftFix.backend.model.Booking;
import SwiftFix.backend.model.BookingStatus;
import SwiftFix.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        // Validate times
        if (booking.getStartTime().isAfter(booking.getEndTime())) {
            throw new RuntimeException("Start time must be before end time");
        }

        // Check for time slot conflicts - blocks exact same time, fully overlapping, and partially overlapping bookings
        List<Booking> resourceOverlaps = bookingRepository.findOverlappingBookings(
                booking.getResourceId(),
                booking.getDate(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        if (!resourceOverlaps.isEmpty()) {
            throw new RuntimeException("Time slot already booked");
        }

        // Check if user already has another booking during this time range
        List<Booking> userOverlaps = bookingRepository.findOverlappingUserBookings(
                booking.getUserId(),
                booking.getDate(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        if (!userOverlaps.isEmpty()) {
            throw new RuntimeException("Time slot already booked");
        }

        booking.setStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only PENDING bookings can be confirmed");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

    public Booking rejectBooking(Long id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only PENDING bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException("Only CONFIRMED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setRejectionReason(reason);
        return bookingRepository.save(booking);
    }
}
