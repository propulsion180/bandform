package xyz.wmmp.bandform_backend.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.BandPosition;
import xyz.wmmp.bandform_backend.data.Genre;
import xyz.wmmp.bandform_backend.data.Instrument;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.repositories.UserRepository;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Pins the current recommender scoring so the math doesn't silently drift. The
 * SQL Specification is exercised elsewhere; here findAll(spec) is stubbed so we
 * assert only the in-memory scoring in RankingService.rankedUsers.
 */
@ExtendWith(MockitoExtension.class)
class RankingServiceTest {

    @Mock
    private UserRepository userRepository;

    private RankingService rankingService;

    private final Genre rock = new Genre(1L, "Rock");
    private final Instrument guitar = new Instrument(1L, "Guitar");
    private final Instrument bass = new Instrument(2L, "Bass");

    @BeforeEach
    void setUp() {
        rankingService = new RankingService(userRepository);
    }

    private Band bandInAuckland(List<Genre> genres, Instrument... openInstruments) {
        Band b = new Band();
        b.setCity("Auckland");
        b.setCountry("New Zealand");
        b.setGenres(genres);
        b.setOpenPositions(java.util.Arrays.stream(openInstruments).map(i -> {
            BandPosition p = new BandPosition();
            p.setInstrument(i);
            return p;
        }).toList());
        return b;
    }

    private User user(String city, String country, List<Genre> genres, List<Instrument> instruments) {
        User u = new User();
        u.setCity(city);
        u.setCountry(country);
        u.setGenres(genres);
        u.setInstruments(instruments);
        return u;
    }

    @Test
    void scoresLocationGenreAndSingleInstrumentMatch() {
        Band band = bandInAuckland(List.of(rock), guitar);
        User u = user("Auckland", "New Zealand", List.of(rock), List.of(guitar));
        when(userRepository.findAll(any(Specification.class))).thenReturn(List.of(u));

        Map<User, Double> ranked = rankingService.rankedUsers(band, false, false, false, true, 1, 1);

        // country 15 + city 15 + genre (25/1) + single-instrument match 25 = 80
        assertThat(ranked.get(u)).isCloseTo(80.0, within(1e-9));
    }

    @Test
    void multiInstrumentSplitsTheInstrumentScoreAcrossOpenPositions() {
        Band band = bandInAuckland(List.of(rock), guitar, bass);
        // Matches only one of the two open instruments -> 25/2 = 12.5.
        User u = user("Auckland", "New Zealand", List.of(rock), List.of(guitar));
        when(userRepository.findAll(any(Specification.class))).thenReturn(List.of(u));

        Map<User, Double> ranked = rankingService.rankedUsers(band, false, false, false, false, 1, 1);

        // 15 + 15 + 25 + 12.5 = 67.5
        assertThat(ranked.get(u)).isCloseTo(67.5, within(1e-9));
    }

    @Test
    void locationWeightScalesTheLocationAndGenreContribution() {
        Band band = bandInAuckland(List.of(rock), guitar);
        User u = user("Auckland", "New Zealand", List.of(rock), List.of(guitar));
        when(userRepository.findAll(any(Specification.class))).thenReturn(List.of(u));

        Map<User, Double> ranked = rankingService.rankedUsers(band, false, false, false, true, 2, 1);

        // (15 + 15 + 25) * locWeight(2) + single-instrument 25 = 135
        assertThat(ranked.get(u)).isCloseTo(135.0, within(1e-9));
    }

    @Test
    void noMatchesScoresZero() {
        Band band = bandInAuckland(List.of(rock), guitar);
        User u = user("Sydney", "Australia", List.of(new Genre(9L, "Jazz")), List.of(bass));
        when(userRepository.findAll(any(Specification.class))).thenReturn(List.of(u));

        Map<User, Double> ranked = rankingService.rankedUsers(band, false, false, false, true, 1, 1);

        assertThat(ranked.get(u)).isCloseTo(0.0, within(1e-9));
    }
}
