package xyz.wmmp.bandform_backend.data;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jdk.jfr.Enabled;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bands")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Band{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty
    @NotBlank
    @Column(nullable = false)
    private String name;


    private String description;

    private String city;

    private String country;

    @ManyToMany
    @JoinTable(
            name = "band_genres",
            joinColumns = @JoinColumn(name = "band_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private List<Genre> genres = new ArrayList<>();

    @OneToMany(mappedBy = "band", cascade = CascadeType.ALL)
    private List<BandMember> members = new ArrayList<>();

    @OneToMany(mappedBy = "band", cascade = CascadeType.ALL)
    private List<BandPosition> openPositions = new ArrayList<>();

    @OneToMany(mappedBy = "band", cascade = CascadeType.ALL)
    private List<JoinRequest> joinRequests = new ArrayList<>();

}