package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.services.BandAuthorizationService;
import xyz.wmmp.bandform_backend.services.BandService;
import xyz.wmmp.bandform_backend.services.UserService;

import java.util.List;

@Controller
public class BandResolver {
    private final BandService bandService;
    private final UserService userService;
    private final BandAuthorizationService bandAuthorizationService;

    @Autowired
    public BandResolver(BandService bandService, UserService userService, BandAuthorizationService bandAuthorizationService){
        this.bandService = bandService;
        this.userService = userService;
        this.bandAuthorizationService = bandAuthorizationService;
    }

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    public List<Band> bands(){ return bandService.getAllBands(); }

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    public Band band(@Argument Long id){ return bandService.getBandById(id); }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    public Band createBand(
            @Argument String name,
            @Argument String description,
            @Argument String city,
            @Argument String country,
            @Argument List<String> genres
    ){
        User owner = userService.getUserById(bandAuthorizationService.currentUserId());
        return bandService.createBand(name, description, city, country, genres, owner);
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    public Long updateBand(
            @Argument Long id,
            @Argument String name,
            @Argument String description,
            @Argument String city,
            @Argument String country,
            @Argument List<String> genres
    ){
        bandAuthorizationService.requireBandManager(bandService.getBandById(id));
        return bandService.updateBand(id, name, description, city, country, genres, null, null, null);
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    public Long deleteBand(
            @Argument Long id
    ){
        bandAuthorizationService.requireBandManager(bandService.getBandById(id));
        return bandService.deleteBand(id);
    }

}
