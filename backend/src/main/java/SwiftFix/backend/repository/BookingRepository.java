package SwiftFix.backend.repository;

import SwiftFix.backend.model.Booking;
import SwiftFix.backend.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(String userId);

    @Query("SELECT b FROM Booking b WHERE LOWER(b.resourceId) = LOWER(:resourceId) AND b.date = :date " +
           "AND b.status IN (SwiftFix.backend.model.BookingStatus.CONFIRMED, SwiftFix.backend.model.BookingStatus.PENDING) " +
           "AND (:startTime < b.endTime AND :endTime > b.startTime)")
    List<Booking> findOverlappingBookings(@Param("resourceId") String resourceId,
                                          @Param("date") LocalDate date,
                                          @Param("startTime") LocalTime startTime,
                                          @Param("endTime") LocalTime endTime);

    @Query("SELECT b FROM Booking b WHERE b.userId = :userId AND b.date = :date " +
           "AND b.status IN (SwiftFix.backend.model.BookingStatus.CONFIRMED, SwiftFix.backend.model.BookingStatus.PENDING) " +
           "AND (:startTime < b.endTime AND :endTime > b.startTime)")
    List<Booking> findOverlappingUserBookings(@Param("userId") String userId,
                                              @Param("date") LocalDate date,
                                              @Param("startTime") LocalTime startTime,
                                              @Param("endTime") LocalTime endTime);

    /**
     * Auto-expires only admin-confirmed (CONFIRMED) bookings whose end time has passed.
     * Expired records are kept in the database for history and reference.
     */
    @Modifying
    @Query("UPDATE Booking b SET b.status = SwiftFix.backend.model.BookingStatus.EXPIRED " +
           "WHERE b.status = SwiftFix.backend.model.BookingStatus.CONFIRMED " +
           "AND (b.date < :currentDate OR (b.date = :currentDate AND b.endTime <= :currentTime))")
    int expirePastBookings(@Param("currentDate") LocalDate currentDate,
                           @Param("currentTime") LocalTime currentTime);
}
