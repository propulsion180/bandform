package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import xyz.wmmp.bandform_backend.data.JoinRequest;
import xyz.wmmp.bandform_backend.services.JoinRequestService;

import java.util.List;

@Controller
public class JoinRequestResolver {
    private final JoinRequestService joinRequestService;

    @Autowired
    public JoinRequestResolver(JoinRequestService joinRequestService){
        this.joinRequestService = joinRequestService;
    }

    @QueryMapping
    public JoinRequest joinRequest(@Argument Long id){
        return joinRequestService.getJoinRequestById(id);
    }

    @QueryMapping
    public List<JoinRequest> userJoinRequests(@Argument Long uID){
        return joinRequestService.getUserJoinRequests(uID);
    }

    @QueryMapping
    public List<JoinRequest> bandJoinRequests(@Argument Long bID){
        return joinRequestService.getBandJoinRequests(bID);
    }

    @MutationMapping
    public JoinRequest createJoinRequest(
            @Argument Long uID,
            @Argument Long bID,
            @Argument Long bpId,
            @Argument List<String> interestedInstruments,
            @Argument String message
    ){
        return joinRequestService.createJoinRequest(uID, bID, bpId, interestedInstruments, message);
    }

    @MutationMapping
    public Long deleteJoinRequest(@Argument Long id){
        return joinRequestService.deleteJoinRequestById(id);
    }

    @MutationMapping
    public Long reject(@Argument Long id){
        return joinRequestService.reject(id);
    }

    @MutationMapping
    public Long accept(@Argument Long id){
        return joinRequestService.accept(id);
    }
}
