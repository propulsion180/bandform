package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.BandPosition;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.services.BandAuthorizationService;
import xyz.wmmp.bandform_backend.services.BandPositionService;
import xyz.wmmp.bandform_backend.services.BandService;
import xyz.wmmp.bandform_backend.services.UserService;

import java.util.List;

@Controller
public class BandPositionResolver {
    private final BandPositionService bandPositionService;
    private final UserService userService;
    private final BandService bandService;
    private final BandAuthorizationService bandAuthorizationService;

    @Autowired
    public BandPositionResolver(BandPositionService bandPositionService, UserService userService, BandService bandService, BandAuthorizationService bandAuthorizationService){
        this.bandPositionService = bandPositionService;
        this.userService = userService;
        this.bandService = bandService;
        this.bandAuthorizationService = bandAuthorizationService;
    }

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    public BandPosition bandPosition(@Argument Long id){
        return bandPositionService.getBandPositionById(id);
    }

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    public List<BandPosition> positionsInBand(Long bId){
        return bandPositionService.getBandPositionsInBand(bId);
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    public BandPosition createBandPosition(@Argument Long bandId, @Argument String instrumentName, @Argument String description){
        bandAuthorizationService.requireBandManager(bandService.getBandById(bandId));
        return bandPositionService.createBandPosition(bandId, instrumentName, description);
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    public Long updateBandPosition(Long bpId, Long bId, String instrument, String description, Boolean filled, Long fillerId){
        bandAuthorizationService.requireBandManager(bandPositionService.getBandPositionById(bpId).getBand());
        Band band = bId != null ? bandService.getBandById(bId) : null;
        User filler = fillerId != null ? userService.getUserById(fillerId) : null;
        return bandPositionService.updateBandPosition(bpId, band, instrument, description, filled, filler);
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    public Long deleteBandPosition(Long pbId){
        bandAuthorizationService.requireBandManager(bandPositionService.getBandPositionById(pbId).getBand());
        return bandPositionService.deleteBandPosition(pbId);
    }

}
