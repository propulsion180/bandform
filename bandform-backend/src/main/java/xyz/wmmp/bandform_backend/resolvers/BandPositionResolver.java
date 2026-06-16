package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import xyz.wmmp.bandform_backend.data.BandMember;
import xyz.wmmp.bandform_backend.services.BandPositionService;

import java.util.List;

@Controller
public class BandPositionResolver {
    private final BandPositionService bandPositionService;

    @Autowired
    public BandPositionResolver(BandPositionService bandPositionService){
        this.bandPositionService = bandPositionService;
    }

    @QueryMapping
    public List<BandMember> getMemberInBand(@Argument Long bandId){

    }


}
