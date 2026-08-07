package xyz.wmmp.bandform_backend.devdata;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.BandPosition;
import xyz.wmmp.bandform_backend.data.JoinRequest;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.data.UserStatus;
import xyz.wmmp.bandform_backend.data.UserType;
import xyz.wmmp.bandform_backend.repositories.UserRepository;
import xyz.wmmp.bandform_backend.services.BandMemberService;
import xyz.wmmp.bandform_backend.services.BandPositionService;
import xyz.wmmp.bandform_backend.services.BandService;
import xyz.wmmp.bandform_backend.services.JoinRequestService;
import xyz.wmmp.bandform_backend.services.UserService;

import java.util.List;
import java.util.function.Supplier;

/**
 * Populates the (in-memory, wiped-on-restart) dev database with enough
 * users/bands/join-requests to manually exercise every page. Disable via
 * app.seed-data.enabled=false once this runs against a persistent database.
 */
@Component
@ConditionalOnProperty(prefix = "app.seed-data", name = "enabled", havingValue = "true", matchIfMissing = true)
public class DevDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DevDataSeeder.class);
    private static final String PASSWORD = "password123";
    private static final int DEFAULT_AGE = 27;

    private final UserService userService;
    private final UserRepository userRepository;
    private final BandService bandService;
    private final BandPositionService bandPositionService;
    private final BandMemberService bandMemberService;
    private final JoinRequestService joinRequestService;

    public DevDataSeeder(
            UserService userService,
            UserRepository userRepository,
            BandService bandService,
            BandPositionService bandPositionService,
            BandMemberService bandMemberService,
            JoinRequestService joinRequestService
    ) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.bandService = bandService;
        this.bandPositionService = bandPositionService;
        this.bandMemberService = bandMemberService;
        this.joinRequestService = joinRequestService;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Seeding dev data...");

        User owner = createUser("Olivia Owner", "owner@bandform.test", "Auckland", "New Zealand",
                "Guitarist looking to lead a band.", List.of("Rock", "Indie"), List.of("Guitar"));
        setRole(owner, UserType.OWNER);

        User admin = createUser("Alex Admin", "admin@bandform.test", "Wellington", "New Zealand",
                "Keeps things running.", List.of("Pop"), List.of("Vocals"));
        setRole(admin, UserType.ADMIN);

        User normal = createUser("Nora Normal", "normal@bandform.test", "Auckland", "New Zealand",
                "Drummer, easy going.", List.of("Rock"), List.of("Drums"));

        User seeker = createUser("Sam Seeker", "seeker@bandform.test", "Auckland", "New Zealand",
                "Looking for a band to join.", List.of("Rock", "Jazz"), List.of("Bass"));

        User pool1 = createPoolUser("Priya Patel", "Wellington", "New Zealand", List.of("Electronic", "Pop"), List.of("Synth"), UserStatus.NOBANDRAND);
        User pool2 = createPoolUser("Jordan Lee", "Wellington", "New Zealand", List.of("Electronic"), List.of("Vocals"), UserStatus.NOBANDRAND);
        User pool3 = createPoolUser("Marcus Chen", "Christchurch", "New Zealand", List.of("Metal", "Rock"), List.of("Guitar"), UserStatus.NOBANDSEL);
        User pool4 = createPoolUser("Bella Fox", "Christchurch", "New Zealand", List.of("Metal"), List.of("Bass"), UserStatus.NOBANDSEL);
        User pool5 = createPoolUser("Theo Walsh", "Christchurch", "New Zealand", List.of("Rock"), List.of("Drums"), UserStatus.NOBANDRAND);
        User pool6 = createPoolUser("Hana Kobayashi", "Auckland", "New Zealand", List.of("Jazz", "Blues"), List.of("Saxophone"), UserStatus.NOBANDSEL);
        User pool7 = createPoolUser("Leo Rossi", "Auckland", "New Zealand", List.of("Jazz"), List.of("Bass"), UserStatus.NOBANDSEL);
        createPoolUser("Fatima Noor", "Auckland", "New Zealand", List.of("Indie", "Rock"), List.of("Keyboard"), UserStatus.NOBANDRAND);
        createPoolUser("Connor Blake", "Wellington", "New Zealand", List.of("Folk"), List.of("Violin"), UserStatus.NOBANDRAND);
        createPoolUser("Aroha Ngata", "Auckland", "New Zealand", List.of("Hip-Hop"), List.of("Vocals"), UserStatus.NOBANDSEL);
        createPoolUser("Ryan Cooper", "Melbourne", "Australia", List.of("Rock"), List.of("Drums"), UserStatus.NOBANDRAND);
        createPoolUser("Ella Simmons", "Sydney", "Australia", List.of("Pop"), List.of("Vocals"), UserStatus.NOBANDSEL);
        createPoolUser("Noah Kim", "Melbourne", "Australia", List.of("Electronic"), List.of("Synth"), UserStatus.NOBANDRAND);
        createPoolUser("Grace Taylor", "Sydney", "Australia", List.of("Classical"), List.of("Violin"), UserStatus.NOBANDSEL);

        Band ownersBand = bandService.createBand("The Owners Band",
                "Original rock/indie, weekly rehearsals in Auckland.", "Auckland", "New Zealand",
                List.of("Rock", "Indie"), owner);
        bandMemberService.createBandMember(ownersBand.getId(), owner.getId(), List.of("Guitar"), "Guitarist");
        bandMemberService.createBandMember(ownersBand.getId(), normal.getId(), List.of("Drums"), "Drummer");
        BandPosition ownersBassPosition = bandPositionService.createBandPosition(ownersBand.getId(), "Bass",
                "Looking for a solid bassist for weekly rehearsals.");
        runAs(seeker, () -> joinRequestService.createJoinRequest(seeker.getId(), ownersBand.getId(), ownersBassPosition.getId(),
                List.of("Bass"), "Hey! I'd love to jam with you all, I've been playing bass for 6 years."));

        Band midnightStatic = bandService.createBand("Midnight Static", "Synth-driven electropop.",
                "Wellington", "New Zealand", List.of("Electronic", "Pop"), pool1);
        bandMemberService.createBandMember(midnightStatic.getId(), pool1.getId(), List.of("Synth"), "Founder");
        BandPosition midnightVocalsPosition = bandPositionService.createBandPosition(midnightStatic.getId(),
                "Vocals", "Need a lead vocalist for our next EP.");
        JoinRequest midnightRequest = runAs(pool2, () -> joinRequestService.createJoinRequest(pool2.getId(), midnightStatic.getId(),
                midnightVocalsPosition.getId(), List.of("Vocals"), "I've got a demo reel if you want to hear it."));
        runAs(pool1, () -> joinRequestService.accept(midnightRequest.getId(), "Vocalist"));

        Band rustAndBone = bandService.createBand("Rust & Bone", "Heavy, riff-driven metal.",
                "Christchurch", "New Zealand", List.of("Metal", "Rock"), pool3);
        bandMemberService.createBandMember(rustAndBone.getId(), pool3.getId(), List.of("Guitar"), "Guitarist");
        bandMemberService.createBandMember(rustAndBone.getId(), pool4.getId(), List.of("Bass"), "Bassist");
        BandPosition rustDrumsPosition = bandPositionService.createBandPosition(rustAndBone.getId(), "Drums",
                "Need a drummer who can handle double-kick.");
        BandPosition rustFilledPosition = bandPositionService.createBandPosition(rustAndBone.getId(), "Guitar",
                "Second guitarist.");
        bandPositionService.updateBandPosition(rustFilledPosition.getId(), null, null, null, true, pool3);
        JoinRequest rustRequest = runAs(pool5, () -> joinRequestService.createJoinRequest(pool5.getId(), rustAndBone.getId(),
                rustDrumsPosition.getId(), List.of("Drums"), "I play in a similar style, check out my old band."));
        runAs(pool3, () -> joinRequestService.reject(rustRequest.getId()));

        Band harbourJazz = bandService.createBand("Harbour Jazz Collective", "Laid-back jazz and blues.",
                "Auckland", "New Zealand", List.of("Jazz", "Blues"), pool6);
        bandMemberService.createBandMember(harbourJazz.getId(), pool6.getId(), List.of("Saxophone"), "Saxophonist");
        bandMemberService.createBandMember(harbourJazz.getId(), pool7.getId(), List.of("Bass"), "Bassist");

        log.info("=== Seeded dev accounts (password: {}) ===", PASSWORD);
        log.info("OWNER  owner@bandform.test  (owns The Owners Band)");
        log.info("ADMIN  admin@bandform.test");
        log.info("NORMAL normal@bandform.test  (member, not owner, of The Owners Band)");
        log.info("NORMAL seeker@bandform.test  (unattached, has a pending request)");
        log.info("Plus 14 more pooled users, mostly unattached, sharing the same password.");
        log.info("=== Seeded bands: The Owners Band, Midnight Static, Rust & Bone, Harbour Jazz Collective ===");
    }

    private User createUser(String name, String email, String city, String country, String description,
                             List<String> genres, List<String> instruments) {
        userService.createUser(name, email, PASSWORD, DEFAULT_AGE, city, country, description, genres, instruments, null);
        return userRepository.findByName(name).orElseThrow();
    }

    private User createPoolUser(String name, String city, String country, List<String> genres,
                                 List<String> instruments, UserStatus status) {
        String email = name.toLowerCase().replace(" ", ".") + "@bandform.test";
        User user = createUser(name, email, city, country, "Looking to play.", genres, instruments);
        setStatus(user, status);
        return user;
    }

    private void setRole(User user, UserType role) {
        user.setRole(role);
        userRepository.save(user);
    }

    private void setStatus(User user, UserStatus status) {
        user.setStatus(status);
        userRepository.save(user);
    }

    /**
     * The seeder runs outside any HTTP request, so there's no JWT-derived
     * SecurityContext for the services' self/band-manager authorization
     * checks to read. Temporarily impersonates the given user (same
     * principal shape JwtAuthFilter builds for a real request) for the
     * duration of the action, then restores whatever was there before.
     */
    private <T> T runAs(User user, Supplier<T> action) {
        Authentication original = SecurityContextHolder.getContext().getAuthentication();
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(user.getRole().toString()));
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user.getId().toString(), null, authorities));
        try {
            return action.get();
        } finally {
            SecurityContextHolder.getContext().setAuthentication(original);
        }
    }
}
