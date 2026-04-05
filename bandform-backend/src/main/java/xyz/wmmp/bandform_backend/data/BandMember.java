package xyz.wmmp.bandform_backend.data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "band_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BandMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "band_id", nullable = false)
    private Band band;

    @ManyToMany
    @JoinTable(
            name = "band_member_instruments",
            joinColumns = @JoinColumn(name = "band_member_id"),
            inverseJoinColumns = @JoinColumn(name = "instrument_id")
    )
    private List<Instrument> instruments = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime joinedDate;

    private String role;
}