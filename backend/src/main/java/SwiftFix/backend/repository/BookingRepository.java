package SwiftFix.backend.repository;

import SwiftFix.backend.model.Booking;
import SwiftFix.backend.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(String userId);

    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resourceId AND b.date = :date " +
           "AND b.status IN (SwiftFix.backend.model.BookingStatus.PENDING, SwiftFix.backend.model.BookingStatus.APPROVED) " +
           "AND (:startTime < b.endTime AND :endTime > b.startTime)")
    List<Booking> findOverlappingBookings(@Param("resourceId") String resourceId,
                                          @Param("date") LocalDate date,
                                          @Param("startTime") LocalTime startTime,
                                          @Param("endTime") LocalTime endTime);
}
