package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.services.BandService;

import java.util.List;

@Controller
public class BandResolver {
    private final BandService bandService;

    @Autowired
    public BandResolver(BandService bandService){
        this.bandService = bandService;
    }

    @QueryMapping
    public List<Band> bands(){ return bandService.getAllBands(); }

    @QueryMapping
    public Band band(@Argument Long id){ return bandService.getBandById(id); }

    @MutationMapping
    public Band createBand(
            @Argument String name,
            @Argument String description,
            @Argument String city,
            @Argument String country,
            @Argument List<String> genres
    ){
        return bandService.createBand(name, description, city, country, genres);
    }

    @MutationMapping
    public Long updateBand(
            @Argument Long id,
            @Argument String name,
            @Argument String description,
            @Argument String city,
            @Argument String country,
            @Argument List<String> genres
    ){
        return bandService.updateBand(id, name, description, city, country, genres, null, null, null);
    }

    @MutationMapping
    public Long deleteBand(
            @Argument Long id
    ){
        return bandService.deleteBand(id);
    }

}
