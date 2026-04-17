package SwiftFix.backend.service;

import SwiftFix.backend.exception.ResourceNotFoundException;
import SwiftFix.backend.model.Resource;
import SwiftFix.backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

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
