package xyz.wmmp.bandform_backend.data;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
        @Column(nullable = false)
        private String name;

        @NotNull
        @Column(nullable = false)
        private Integer age;

        @NotEmpty
        @NotBlank
        private String city;

        @NotEmpty
        @NotBlank
        private String country;

        private String description;

        @ManyToMany
        @JoinTable(name = "user_genres", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "genre_id"))
        private List<Genre> genres = new ArrayList<>();

        @ManyToMany
        @JoinTable(name = "user_instruments", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "instrument_id"))
        private List<Instrument> instruments = new ArrayList<>();

        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
        private List<BandMember> bandMemberships = new ArrayList<>();
}
