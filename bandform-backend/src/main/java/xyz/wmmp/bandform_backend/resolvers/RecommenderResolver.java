package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.UserProfile;

import java.util.List;

@Controller
public class RecommenderResolver {


    @QueryMapping
    public List<Band> recommendBand(){

    }

    @QueryMapping
    public List<UserProfile> recommendUser(){

    }
}
