package SwiftFix.backend.service;

import SwiftFix.backend.exception.ResourceNotFoundException;
import SwiftFix.backend.model.Resource;
import SwiftFix.backend.repository.ResourceRepository;
import SwiftFix.backend.model.ResourceStats;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public ResourceStats getResourceStats() {
        List<Resource> resources = resourceRepository.findAll();
        
        long totalCount = resources.size();
        long activeCount = resources.stream().filter(r -> "ACTIVE".equals(r.getStatus())).count();
        long maintenanceCount = resources.stream().filter(r -> "OUT_OF_SERVICE".equals(r.getStatus())).count();
        Map<String, Long> typeBreakdown = resources.stream()
                .collect(Collectors.groupingBy(Resource::getType, Collectors.counting()));
                
        return new ResourceStats(totalCount, activeCount, maintenanceCount, typeBreakdown);
    }

    public Resource createResource(Resource resource) {
        if (resource.getStatus() == null) {
            resource.setStatus("ACTIVE");
        }
        return resourceRepository.save(resource);
    }

    public List<Resource> getResources(String type, Integer capacity, String location) {
        return resourceRepository.findWithFilters(type, capacity, location);
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    public Resource updateResource(Long id, Resource resourceDetails) {
        Resource resource = getResourceById(id);
        
        if (resourceDetails.getName() != null) resource.setName(resourceDetails.getName());
        if (resourceDetails.getType() != null) resource.setType(resourceDetails.getType());
        if (resourceDetails.getCapacity() != null) resource.setCapacity(resourceDetails.getCapacity());
        if (resourceDetails.getLocation() != null) resource.setLocation(resourceDetails.getLocation());
        if (resourceDetails.getAvailabilityWindows() != null) resource.setAvailabilityWindows(resourceDetails.getAvailabilityWindows());
        if (resourceDetails.getStatus() != null) resource.setStatus(resourceDetails.getStatus());
        
        return resourceRepository.save(resource);
    }

    public void deleteResource(Long id) {
        Resource resource = getResourceById(id);
        resourceRepository.delete(resource);
    }
}
