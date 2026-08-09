package xyz.wmmp.bandform_backend.data;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "join_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JoinRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "band_id", nullable = false)
    private Band band;

    @ManyToOne
    @JoinColumn(name = "position_id")
    private BandPosition position;

    @ManyToMany
    @JoinTable(
            name = "join_request_instruments",
            joinColumns = @JoinColumn(name = "join_request_id"),
            inverseJoinColumns = @JoinColumn(name = "instrument_id")
    )
    private List<Instrument> interestedInstruments = new ArrayList<>();

    @Size(max = 1000)
    @Column(length = 1000)
    private String message;

    @Column(nullable = false)
    private LocalDateTime requestedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    // false: the musician (user) requested to join the band.
    // true: the band invited the musician; proposedRole is the role offered.
    @Column(nullable = false)
    private boolean invitedByBand = false;

    @Size(max = 100)
    private String proposedRole;
}