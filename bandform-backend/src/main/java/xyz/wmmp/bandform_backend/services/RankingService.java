package xyz.wmmp.bandform_backend.services;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.Genre;
import xyz.wmmp.bandform_backend.data.Instrument;
import xyz.wmmp.bandform_backend.data.User;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RankingService {
    public Map<User, Double> rankedUsers(
            Band b,
            Boolean withinCity,
            Boolean withinCountry,
            Boolean sameGenre,
            Boolean singleInstrument,
            Integer locWeight,
            Integer genreWeight,
    ){
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

        return potUsers;
    }
}
