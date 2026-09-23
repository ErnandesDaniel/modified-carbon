package ru.scms.back.enums;

public enum UserAuthProvider {
    GOOGLE("google"),
    GITHUB("github"),
    LOCAL("local");

    private final String code;

    UserAuthProvider(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public static UserAuthProvider fromString(String provider) {
        if (provider == null) {
            return GOOGLE;
        }
        for (UserAuthProvider value : values()) {
            if (value.code.equalsIgnoreCase(provider) || value.name().equalsIgnoreCase(provider)) {
                return value;
            }
        }
        return GOOGLE;
    }
}
