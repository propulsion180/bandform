package xyz.wmmp.bandform_backend.services;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import xyz.wmmp.bandform_backend.authsec.PasswordPolicy;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.data.UserProfile;
import xyz.wmmp.bandform_backend.data.UserStatus;
import xyz.wmmp.bandform_backend.data.UserType;
import xyz.wmmp.bandform_backend.repositories.GenreRepository;
import xyz.wmmp.bandform_backend.repositories.InstrumentRepository;
import xyz.wmmp.bandform_backend.repositories.UserRepository;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

/**
 * Branch coverage for the validation rules in UserService.createUser / updateUser.
 * Repositories and the password encoder are mocked; the real PasswordPolicy is
 * used so the create path exercises the authoritative password rule.
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private GenreRepository genreRepository;
    @Mock private InstrumentRepository instrumentRepository;
    @Mock private GenreService genreService;
    @Mock private InstrumentService instrumentService;
    @Mock private BandMemberService bandMemberService;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private BandAuthorizationService bandAuthorizationService;

    private UserService userService;

    private static final String EMAIL = "jo@example.com";
    private static final String STRONG = "Abcdef12";

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, genreRepository, instrumentRepository,
                genreService, instrumentService, bandMemberService, passwordEncoder,
                bandAuthorizationService, new PasswordPolicy());
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    private UserProfile createValid(Integer age, UserStatus status) {
        return userService.createUser("Jo", EMAIL, STRONG, age, "Auckland", "New Zealand",
                "desc", List.of("Rock"), List.of("Guitar"), status);
    }

    // ---- createUser -------------------------------------------------------

    @Test
    void createUserHappyPathSavesANormalUser() {
        when(userRepository.findByName("Jo")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(STRONG)).thenReturn("hashed");
        when(genreService.getGenresByNameAndAddIfNecessary(anyList())).thenReturn(List.of());
        when(instrumentService.getInstrumentsByNameAndAddIfNecessary(anyList())).thenReturn(List.of());
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(1L);
            return u;
        });

        UserProfile profile = createValid(25, UserStatus.NOBANDSEL);

        assertThat(profile.id()).isEqualTo(1L);
        assertThat(profile.role()).isEqualTo(UserType.NORMAL);
    }

    @Test
    void createUserRejectsADuplicateName() {
        when(userRepository.findByName("Jo")).thenReturn(Optional.of(new User()));

        assertThatThrownBy(() -> createValid(25, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("UserName already taken");
    }

    @Test
    void createUserRejectsAnInvalidEmail() {
        when(userRepository.findByName("Jo")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.createUser("Jo", "not-an-email", STRONG, 25,
                "Auckland", "New Zealand", "desc", List.of(), List.of(), null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid Email Address");
    }

    @Test
    void createUserRejectsAWeakPassword() {
        when(userRepository.findByName("Jo")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.createUser("Jo", EMAIL, "weak", 25,
                "Auckland", "New Zealand", "desc", List.of(), List.of(), null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage(PasswordPolicy.DESCRIPTION);
    }

    @Test
    void createUserRejectsUnderageAndImplausibleAges() {
        when(userRepository.findByName("Jo")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(STRONG)).thenReturn("hashed");

        assertThatThrownBy(() -> createValid(15, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("16 or older");
        assertThatThrownBy(() -> createValid(121, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("16 or older");
    }

    @Test
    void createUserRejectsAnInBandStatusForANewUser() {
        when(userRepository.findByName("Jo")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(STRONG)).thenReturn("hashed");
        when(genreService.getGenresByNameAndAddIfNecessary(anyList())).thenReturn(List.of());
        when(instrumentService.getInstrumentsByNameAndAddIfNecessary(anyList())).thenReturn(List.of());

        assertThatThrownBy(() -> createValid(25, UserStatus.BAND))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("NOBANDRAND or NOBANDSEL");
    }

    // ---- updateUser -------------------------------------------------------

    private void authenticateAs(String userId) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(userId, null));
    }

    @Test
    void updateUserForbidsANormalUserEditingSomeoneElse() {
        authenticateAs("2");
        User normalUpdater = new User();
        normalUpdater.setRole(UserType.NORMAL);
        when(userRepository.findById(2L)).thenReturn(Optional.of(normalUpdater));

        assertThatThrownBy(() -> userService.updateUser(1L, "New", null, null, null, null, null,
                null, null, null, null, null))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void updateUserRejectsAnInconsistentBandStatus() {
        authenticateAs("1");
        User self = new User();                 // no band memberships
        lenient().when(userRepository.findById(1L)).thenReturn(Optional.of(self));

        assertThatThrownBy(() -> userService.updateUser(1L, null, null, null, null, null, null,
                UserStatus.BAND, null, null, null, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not in a band");
    }
}
