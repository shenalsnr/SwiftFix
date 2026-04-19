package SwiftFix.backend.model;

public enum Faculty {
    COMPUTING("Faculty of Computing"),
    BUSINESS("Faculty of Business"),
    ENGINEERING("Faculty of Engineering"),
    HUMANITIES_SCIENCES("Faculty of Humanities & Sciences");

    private final String displayName;

    Faculty(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
