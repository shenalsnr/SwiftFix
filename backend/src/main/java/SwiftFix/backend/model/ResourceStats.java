package SwiftFix.backend.model;

import java.util.Map;

public class ResourceStats {
    private long totalCount;
    private long activeCount;
    private long maintenanceCount;
    private Map<String, Long> typeBreakdown;

    public ResourceStats() {
    }

    public ResourceStats(long totalCount, long activeCount, long maintenanceCount, Map<String, Long> typeBreakdown) {
        this.totalCount = totalCount;
        this.activeCount = activeCount;
        this.maintenanceCount = maintenanceCount;
        this.typeBreakdown = typeBreakdown;
    }

    public long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
    }

    public long getActiveCount() {
        return activeCount;
    }

    public void setActiveCount(long activeCount) {
        this.activeCount = activeCount;
    }

    public long getMaintenanceCount() {
        return maintenanceCount;
    }

    public void setMaintenanceCount(long maintenanceCount) {
        this.maintenanceCount = maintenanceCount;
    }

    public Map<String, Long> getTypeBreakdown() {
        return typeBreakdown;
    }

    public void setTypeBreakdown(Map<String, Long> typeBreakdown) {
        this.typeBreakdown = typeBreakdown;
    }
}
