package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.BandMember;
import xyz.wmmp.bandform_backend.data.BandPosition;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.services.BandPositionService;
import xyz.wmmp.bandform_backend.services.BandService;
import xyz.wmmp.bandform_backend.services.UserService;

import java.util.List;

@Controller
public class BandPositionResolver {
    private final BandPositionService bandPositionService;
    private final UserService userService;
    private final BandService bandService;

    @Autowired
    public BandPositionResolver(BandPositionService bandPositionService, UserService userService, BandService bandService){
        this.bandPositionService = bandPositionService;
        this.userService = userService;
        this.bandService = bandService;
    }

    @QueryMapping
    public BandPosition bandPosition(@Argument Long id){
        return bandPositionService.getBandPositionById(id);
    }

    @QueryMapping
    public List<BandPosition> positionsInBand(Long bId){
        return bandPositionService.getBandPositionsInBand(bId);
    }

    @MutationMapping
    public BandPosition createBandPosition(@Argument Long bandId, @Argument String instrumentName, @Argument String description){
        return bandPositionService.createBandPosition(bandId, instrumentName, description);
    }

    @MutationMapping
    public Long updateBandPosition(Long bpId, Long bId, String instrument, String description, boolean filled, Long fillerId){
        return bandPositionService.updateBandPosition(bpId, bandService.getBandById(bId), instrument, description, filled, userService.getUserById(fillerId));
    }

    @MutationMapping
    public Long deleteBandPosition(Long pbId){
        return bandPositionService.deleteBandPosition(pbId);
    }




}
