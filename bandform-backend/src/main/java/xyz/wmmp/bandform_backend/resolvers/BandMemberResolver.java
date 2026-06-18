package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import xyz.wmmp.bandform_backend.data.BandMember;
import xyz.wmmp.bandform_backend.services.BandMemberService;

import java.util.List;

@Controller
public class BandMemberResolver {
    BandMemberService bandMemberService;

    @Autowired
    public BandMemberResolver(BandMemberService bandMemberService){
        this.bandMemberService = bandMemberService;
    }

    @QueryMapping
    public List<BandMember> membersInBand(Long bID){
        return bandMemberService.membersInBand(bID);
    }


}
