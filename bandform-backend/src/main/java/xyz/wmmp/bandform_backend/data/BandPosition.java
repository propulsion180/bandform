package xyz.wmmp.bandform_backend.data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "band_positions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BandPosition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "band_id", nullable = false)
    private Band band;

    @ManyToOne
    @JoinColumn(name = "instrument_id", nullable = false)
    private Instrument instrument;

    private String description;

    @Column(nullable = false)
    private boolean filled = false;

    @ManyToOne
    @JoinColumn(name = "filled_by_user_id")
    private User filledBy;

}