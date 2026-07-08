package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import xyz.wmmp.bandform_backend.data.*;
import xyz.wmmp.bandform_backend.repositories.BandRepository;
import xyz.wmmp.bandform_backend.repositories.UserRepository;
import xyz.wmmp.bandform_backend.services.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Controller
public class RecommenderResolver {


    private final UserService userService;
    private final BandRepository bandRepository;
    privat final UserRepository userRepository;

    public RecommenderResolver(UserService userService, BandRepository bandRepository, UserRepository userRepository) {
        this.userService = userService;
        this.bandRepository = bandRepository;
        this.userRepository = userRepository;
    }

    @QueryMapping
    public List<Band> recommendBand(
            @Argument Boolean withinCity,
            @Argument Boolean withinCountry,
            @Argument Boolean sameGenre,
            @Argument Integer locGenreWeight
    ){
        if(locGenreWeight >= -5 || locGenreWeight <= 5 ){ throw new IllegalArgumentException("weighting cant be more than 5 or less than -5 ");}

        Integer locWeight = 5 + locGenreWeight;
        Integer GenreWeight = 5 - locGenreWeight;

        Long uid = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User u = userService.getUserById(uid);

        Specification<Band> spec = Specification.where(null);
        if(withinCity){
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("city"), u.getCity())
            ));
        }

        if(withinCountry){
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("country"), u.getCountry())
            ));
        }

        if(sameGenre){
            spec = spec.and((root, query, criteriaBuilder) -> {
                query.distinct(true);
                return root.join("genres").in(u.getGenres());
            });
        }

        List<Band> potBands = bandRepository.findAll(spec);

        Map<Band, Double> bandsToScore = potBands.stream().collect(Collectors.toMap(b -> b, b -> 0.0));

        for(Band b : bandsToScore.keySet()){
            Double score = 0.0;

            if(b.getCountry().equals(u.getCountry())){
                score += 15.0 * locWeight;
            }

            if(b.getCity().equals(u.getCity())){
                score += 10.0 * locWeight;
            }

            Double genreInc = (25.0 * GenreWeight) / u.getGenres().size();

            for(Genre g : u.getGenres()){
                if(b.getGenres().contains(g)){
                    score += genreInc;
                }
            }

            Set<Instrument> wantedInstruments = b.getOpenPositions().stream().map(BandPosition::getInstrument).collect(Collectors.toSet());

            Double instrumentInc = 50.0 / u.getInstruments().size();

            for(Instrument i : u.getInstruments()){
                if(wantedInstruments.contains(i)){
                    score += instrumentInc;
                }
            }
            bandsToScore.put(b, score);
        }

        return bandsToScore.entrySet().stream().sorted(Map.Entry.<Band, Double>comparingByValue().reversed()).map(Map.Entry::getKey).toList();
    }

    @QueryMapping
    public List<UserProfile> recommendUser(
            @Argument BandPosition bp,
            @Argument Boolean withinCity,
            @Argument Boolean withinCountry,
            @Argument Boolean sameGenre,
            @Argument Boolean singleInstrument,
            @Argument Integer locGenreWeight

    ){
        if(locGenreWeight >= -5 || locGenreWeight <= 5 ){ throw new IllegalArgumentException("weighting cant be more than 5 or less than -5 ");}

        Integer locWeight = 5 + locGenreWeight;
        Integer GenreWeight = 5 - locGenreWeight;

        Band b = bp.getBand();

        Specification<User> spec = Specification.where(null);
        if(withinCity){
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("city"), b.getCity())
            ));
        }

        if(withinCountry){
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("country"), b.getCountry())
            ));
        }


        if(sameGenre){
            spec = spec.and((root, query, criteriaBuilder) -> {
                query.distinct(true);
                return root.join("genres").in(b.getGenres());
            });
        }

        Map<User, Double> potUsers = userRepository.findAll(spec).stream().collect(Collectors.toMap(u -> u, u -> 0.0));

        for(User u : potUsers.keySet()){
            Double score = 0.0;

            if(u.getCountry().equals(b.getCountry())){
                score += 15.0 * locWeight;
            }

            if(u.getCity().equals(b.getCity())){
                score += 15.0 * locWeight;
            }

            Double genreInc = 25.0 / b.getGenres().size();

            for(Genre g : b.getGenres()){
                if(u.getGenres().contains(g)){
                    score += genreInc;
                }
                
            }

            Set<Instrument> bandInstrumentsToCheck = null;

            if(singleInstrument){
                bandInstrumentsToCheck = Set.of(bp.getInstrument());
            }else{
                bandInstrumentsToCheck = b.getOpenPositions().stream().map(pos -> pos.getInstrument()).collect(Collectors.toSet());
            }

            Double instruIncrement = 25.0 / bandInstrumentsToCheck.size();

            for(Instrument i : u.getInstruments()){
                if(bandInstrumentsToCheck.contains(i)){
                    score += instruIncrement;
                }
            }

            potUsers.put(u, score);
        }
        return potUsers.entrySet().stream().sorted(Map.Entry.<User, Double>comparingByValue().reversed()).map(Map.Entry::getKey).map(u -> UserProfile.from(u)).toList();
    }
}
