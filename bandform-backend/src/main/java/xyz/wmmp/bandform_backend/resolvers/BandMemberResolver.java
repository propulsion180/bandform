package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import xyz.wmmp.bandform_backend.data.BandMember;
import xyz.wmmp.bandform_backend.services.BandAuthorizationService;
import xyz.wmmp.bandform_backend.services.BandMemberService;
import xyz.wmmp.bandform_backend.services.BandService;

import java.util.List;

@Controller
public class BandMemberResolver {
    private final BandMemberService bandMemberService;
    private final BandService bandService;
    private final BandAuthorizationService bandAuthorizationService;

    @Autowired
    public BandMemberResolver(BandMemberService bandMemberService, BandService bandService, BandAuthorizationService bandAuthorizationService){
        this.bandMemberService = bandMemberService;
        this.bandService = bandService;
        this.bandAuthorizationService = bandAuthorizationService;
    }

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    public List<BandMember> membersInBand(@Argument Long bID){
        return bandMemberService.membersInBand(bID);
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    public BandMember createBandMember(
            @Argument Long bID,
            @Argument Long uID,
            @Argument List<String> instrumentNames,
            @Argument String role
    ){
        bandAuthorizationService.requireBandManager(bandService.getBandById(bID));
        return bandMemberService.createBandMember(bID, uID, instrumentNames, role);
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    public Long deleteBandMember(@Argument Long bmID){
        BandMember bm = bandMemberService.getBandMemberById(bmID);
        boolean allowed = bandAuthorizationService.isSelf(bm.getUser().getId())
                || bandAuthorizationService.isBandManager(bm.getBand());
        if (!allowed) {
            throw new AccessDeniedException("You can only remove yourself, or manage members if you own this band.");
        }
        return bandMemberService.removeMember(bmID);
    }
}
