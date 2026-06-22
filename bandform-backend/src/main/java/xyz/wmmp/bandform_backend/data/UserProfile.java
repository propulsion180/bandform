package xyz.wmmp.bandform_backend.data;

import java.util.List;

public record UserProfile (Long id, String name, String email, Integer age, String city, String country, String description, List<Genre> genres, List<Instrument> instruments, List<BandMember> members){
    public static UserProfile from(User user){
        return new UserProfile(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAge(),
                user.getCity(),
                user.getCountry(),
                user.getDescription(),
                user.getGenres(),
                user.getInstruments(),
                user.getBandMemberships()
        );
    }
}
