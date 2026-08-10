package xyz.wmmp.bandform_backend.data;

/** One row of the admin monitoring "recent logins" table. */
public record RecentLogin(String userId, String name, String ip, String country, String at) {
    public static RecentLogin from(User u) {
        return new RecentLogin(
                u.getId().toString(),
                u.getName(),
                u.getLastLoginIp(),
                u.getLastLoginCountry(),
                u.getLastLoginAt() == null ? null : u.getLastLoginAt().toString()
        );
    }
}
