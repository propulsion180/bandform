package xyz.wmmp.bandform_backend.services;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.data.UserType;
import xyz.wmmp.bandform_backend.repositories.BandMemberRepository;
import xyz.wmmp.bandform_backend.repositories.UserRepository;

/**
 * Centralizes "who's allowed to do this" checks for band management.
 * Deliberately kept out of the lower-level Band/BandPosition/BandMember
 * services themselves -- those are also called internally by already
 * -authorized flows (e.g. JoinRequestService.accept()), so the checks
 * belong at the GraphQL-facing resolver layer instead. See the resolvers
 * for where this is actually invoked.
 */
@Service
public class BandAuthorizationService {

    private final UserRepository userRepository;
    private final BandMemberRepository bandMemberRepository;

    public BandAuthorizationService(UserRepository userRepository, BandMemberRepository bandMemberRepository) {
        this.userRepository = userRepository;
        this.bandMemberRepository = bandMemberRepository;
    }

    public Long currentUserId() {
        return Long.parseLong((String) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
    }

    /**
     * The current numeric user id, or null when there is no authenticated user
     * (e.g. an anonymous request, or a WebSocket-driven field resolution that
     * runs with no SecurityContext). Lets read-time field guards deny cleanly
     * instead of throwing NumberFormatException on the "anonymousUser" principal.
     */
    public Long currentUserIdOrNull() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof String s)) {
            return null;
        }
        try {
            return Long.parseLong(s);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public boolean isGlobalAdmin(Long userId) {
        User caller = userRepository.findById(userId).orElseThrow();
        return caller.getRole() == UserType.ADMIN || caller.getRole() == UserType.OWNER;
    }

    public boolean isGlobalAdmin() {
        return isGlobalAdmin(currentUserId());
    }

    public boolean isSelf(Long userId) {
        return currentUserId().equals(userId);
    }

    public boolean isBandManager(Band band) {
        return (band.getOwner() != null && band.getOwner().getId().equals(currentUserId())) || isGlobalAdmin();
    }

    public boolean isBandMember(Band band, Long userId) {
        return isGlobalAdmin(userId)
                || bandMemberRepository.findByBandIdAndUserId(band.getId(), userId).isPresent();
    }

    public boolean isBandMember(Band band) {
        return isBandMember(band, currentUserId());
    }

    public void requireSelf(Long userId) {
        if (!isSelf(userId) && !isGlobalAdmin()) {
            throw new AccessDeniedException("You can only do this for your own account.");
        }
    }

    public void requireBandManager(Band band) {
        if (!isBandManager(band)) {
            throw new AccessDeniedException("Only the band owner or a site admin can do this.");
        }
    }

    public void requireBandMember(Band band, Long userId) {
        if (!isBandMember(band, userId)) {
            throw new AccessDeniedException("You must be a member of this band to do this.");
        }
    }

    public void requireBandMember(Band band) {
        requireBandMember(band, currentUserId());
    }
}
