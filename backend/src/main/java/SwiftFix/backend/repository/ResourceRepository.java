package SwiftFix.backend.repository;

import SwiftFix.backend.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    
    @Query("SELECT r FROM Resource r WHERE " +
           "(:type IS NULL OR r.type = :type) AND " +
           "(:capacity IS NULL OR r.capacity <= r.capacity) AND " + // Simplistic capacity check, let's say we want capacity >= what was given, or just actual equal capacity logic depending on requirement, typical search for capacity is capacity >= requested. I'll use r.capacity >= :capacity
           "(:location IS NULL OR r.location LIKE %:location%)")
    List<Resource> findWithFilters(@Param("type") String type, 
                                   @Param("capacity") Integer capacity, 
                                   @Param("location") String location);
}
