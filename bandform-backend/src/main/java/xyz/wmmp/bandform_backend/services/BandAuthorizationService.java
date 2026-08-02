package xyz.wmmp.bandform_backend.services;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.data.UserType;
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

    public BandAuthorizationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Long currentUserId() {
        return Long.parseLong((String) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
    }

    public boolean isGlobalAdmin() {
        User caller = userRepository.findById(currentUserId()).orElseThrow();
        return caller.getRole() == UserType.ADMIN || caller.getRole() == UserType.OWNER;
    }

    public boolean isSelf(Long userId) {
        return currentUserId().equals(userId);
    }

    public boolean isBandManager(Band band) {
        return (band.getOwner() != null && band.getOwner().getId().equals(currentUserId())) || isGlobalAdmin();
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
}
