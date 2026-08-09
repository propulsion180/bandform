package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.data.UserProfile;
import xyz.wmmp.bandform_backend.services.BandAuthorizationService;

/**
 * Field-level guard for the (PII) User.email field. The GraphQL "User" type is
 * populated from two source shapes depending on the path -- UserProfile records
 * (me/users/user/recommendUser) and User entities (band.members[].user,
 * joinRequest.user, bandPosition.filledBy, message.sender, ...). Either way,
 * email is only returned to the user themselves or a global admin/owner;
 * everyone else (including anonymous or WS-context resolution with no
 * SecurityContext) gets null. Schema declares email as nullable so an
 * unauthorized read resolves cleanly to null rather than erroring the parent.
 */
@Controller
public class UserFieldResolver {

    private final BandAuthorizationService bandAuthorizationService;

    public UserFieldResolver(BandAuthorizationService bandAuthorizationService) {
        this.bandAuthorizationService = bandAuthorizationService;
    }

    @SchemaMapping(typeName = "User", field = "email")
    public String email(Object source) {
        Long targetId;
        String email;
        if (source instanceof UserProfile up) {
            targetId = up.id();
            email = up.email();
        } else if (source instanceof User u) {
            targetId = u.getId();
            email = u.getEmail();
        } else {
            return null;
        }

        Long currentId = bandAuthorizationService.currentUserIdOrNull();
        if (currentId == null) {
            return null;
        }
        if (currentId.equals(targetId) || bandAuthorizationService.isGlobalAdmin(currentId)) {
            return email;
        }
        return null;
    }
}
