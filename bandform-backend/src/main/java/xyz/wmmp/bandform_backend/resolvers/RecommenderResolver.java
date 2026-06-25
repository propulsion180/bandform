package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.data.UserProfile;
import xyz.wmmp.bandform_backend.services.UserService;

import java.util.List;

@Controller
public class RecommenderResolver {


    private final UserService userService;

    public RecommenderResolver(UserService userService) {
        this.userService = userService;
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



    }

    @QueryMapping
    public List<UserProfile> recommendUser(){

    }
}
