package xyz.wmmp.bandform_backend.resolvers;

import jakarta.persistence.ManyToMany;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.Instrument;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.data.UserStatus;
import xyz.wmmp.bandform_backend.services.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Controller
public class RandomizedBandCreator {

    private final BandService bandService;
    private final UserService userService;
    private final InstrumentService instrumentService;
    private final BandMemberService bandMemberService;
    private final RankingService rankingService;
    private final BandPositionService bandPositionService;

    public RandomizedBandCreator(BandService bandService, UserService userService, InstrumentService instrumentService, BandMemberService bandMemberService, RankingService rankingService, BandPositionService bandPositionService) {
        this.bandService = bandService;
        this.userService = userService;
        this.instrumentService = instrumentService;
        this.bandMemberService = bandMemberService;
        this.rankingService = rankingService;
        this.bandPositionService = bandPositionService;
    }


    @MutationMapping
    public Band randomizedBandCreator(
            @Argument Long yourUID,
            @Argument String yourInstrument,
            @Argument String yourRole,
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
        List<Instrument> instrus = instrumentService.getInstrumentsByNameAndAddIfNecessary(instruments);
        bandMemberService.createBandMember(b, u, instrumentService.getInstrumentsByNameAndAddIfNecessary(List.of(yourInstrument)), yourRole); //create creater's member with the instrument the creator wants
        instrus.remove(instrumentService.getInstrumentsByNameAndAddIfNecessary(List.of(yourInstrument)).getFirst()); //gets rid of the option for other members to play the instrument

        Map<User, Double> scoredUsers = rankingService.rankedUsers(b, true, true, true, true, 5, 5); // get ordered list of users based on their location, genre preference, and instrument selection.

        // For each instrument, go and find a user whose best instrument is the same and make them a member. Only those who consent for random addition. If it can not find a person whose best instrument is the current one, it will add an open band position for the creator to select from and invite.
        for(Instrument i : instrus){
            Boolean found = false;
            for(User us : scoredUsers.keySet()){
                if(us.getStatus() == UserStatus.BAND || us.getStatus() == UserStatus.BANDSEL || us.getStatus() == UserStatus.NOBANDSEL){scoredUsers.remove(us); continue;}
                if(us.equals(u)){scoredUsers.remove(us); continue;}
                Instrument first = us.getInstruments().getFirst();
                if(i.equals(first)){
                    bandMemberService.createBandMember(b, us, List.of(first), first.getName());
                    scoredUsers.remove(us);
                    found = true;
                    break;
                }
            }

            if(!found){
                bandPositionService.createBandPosition(b, i, "");
            }
        }

        return b;
    }

}
