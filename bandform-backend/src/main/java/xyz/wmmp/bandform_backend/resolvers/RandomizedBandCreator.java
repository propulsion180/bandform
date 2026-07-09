package xyz.wmmp.bandform_backend.resolvers;

import jakarta.persistence.ManyToMany;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.Instrument;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.services.BandMemberService;
import xyz.wmmp.bandform_backend.services.BandService;
import xyz.wmmp.bandform_backend.services.InstrumentService;
import xyz.wmmp.bandform_backend.services.UserService;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Controller
public class RandomizedBandCreator {

    private final BandService bandService;
    private final UserService userService;
    private final InstrumentService instrumentService;
    private final BandMemberService bandMemberService;

    public RandomizedBandCreator(BandService bandService, UserService userService, InstrumentService instrumentService, BandMemberService bandMemberService) {
        this.bandService = bandService;
        this.userService = userService;
        this.instrumentService = instrumentService;
        this.bandMemberService = bandMemberService;
    }


    @MutationMapping
    public Band randomizedBandCreator(
            @Argument String yourUID,
            @Argument String yourInstrument,
            @Argument String name,
            @Argument List<String> instruments,
            @Argument String city,
            @Argument String country,
            @Argument List<String> genres,
            @Argument String description
    ){
        User u = userService.getUserById(yourUID);
        Band b = bandService.createBand(name, description, city, country, genres);

        //find and add users as members without asking for their consent
        Set<Instrument> instrus = instrumentService.getInstrumentsByNameAndAddIfNecessary(instruments).stream().collect(Collectors.toSet());
        bandMemberService.createBandMember(b, u, instrumentService.getInstrumentsByNameAndAddIfNecessary(List.of(yourInstrument)), )
        for(Instrument i )

        return b;
    }

}
