package xyz.wmmp.bandform_backend.resolvers;

import jakarta.persistence.ManyToMany;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.services.BandService;

import java.util.List;

@Controller
public class RandomizedBandCreator {

    private final BandService bandService;

    public RandomizedBandCreator(BandService bandService) {
        this.bandService = bandService;
    }


    @MutationMapping
    public Band randomizedBandCreator(
            @Argument String name,
            @Argument List<String> instruments,
            @Argument String city,
            @Argument String country,
            @Argument List<String> genres,
            @Argument String description
    ){
        Band b = bandService.createBand(name, description, city, country, genres);

        //find and add users as members without asking for their consent.

        return b;
    }

}
