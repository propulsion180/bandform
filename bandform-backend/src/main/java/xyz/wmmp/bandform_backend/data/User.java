package xyz.wmmp.bandform_backend.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @NotEmpty
        @NotNull
        @Size(max = 50)
        @Column(nullable = false)
        private String name;

        @Size(max = 254)
        @Column(nullable = false)
        private String email;

        @JsonIgnore
        @Column(nullable = false)
        private String passwordHash;

        @JsonIgnore
        private String jtiToken;

        @JsonIgnore
        private Instant tokenExpiry;

        @NotNull
        @Column(nullable = false)
        private Integer age;

        @NotEmpty
        @NotBlank
        @Size(max = 100)
        private String city;

        @NotEmpty
        @NotBlank
        @Size(max = 100)
        private String country;

        @Size(max = 500)
        @Column(length = 500)
        private String description;

        @NotNull
        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private UserType role;

        private boolean locked = false;

        @JsonIgnore
        @Column(nullable = false)
        private int failedLoginAttempts = 0;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private UserStatus status = UserStatus.NOBANDSEL;

        @ManyToMany
        @JoinTable(name = "user_genres", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "genre_id"))
        private List<Genre> genres = new ArrayList<>();

        @ManyToMany
        @JoinTable(name = "user_instruments", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "instrument_id"))
        private List<Instrument> instruments = new ArrayList<>();

        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
        private List<BandMember> bandMemberships = new ArrayList<>();

        
        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
        private List<Notification> notifications = new ArrayList<>();
}
