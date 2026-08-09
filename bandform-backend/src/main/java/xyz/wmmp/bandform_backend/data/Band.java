package xyz.wmmp.bandform_backend.data;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
    @Size(max = 100)
    @Column(nullable = false)
    private String name;


    @Size(max = 1000)
    @Column(length = 1000)
    private String description;

    @Size(max = 100)
    private String city;

    @Size(max = 100)
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

    // Per-band creator/manager -- distinct from the site-wide UserType.OWNER
    // role. Any user, regardless of global role, owns the bands they create.
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

}