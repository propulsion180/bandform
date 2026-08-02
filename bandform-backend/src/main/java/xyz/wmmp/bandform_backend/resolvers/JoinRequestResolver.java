package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    public JoinRequest joinRequest(@Argument Long id){
        return joinRequestService.getJoinRequestById(id);
    }

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    public List<JoinRequest> userJoinRequests(@Argument Long uID){
        return joinRequestService.getUserJoinRequests(uID);
    }

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    public List<JoinRequest> bandJoinRequests(@Argument Long bID){
        return joinRequestService.getBandJoinRequests(bID);
    }

    @PreAuthorize("isAuthenticated()")
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

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    public JoinRequest inviteToBand(
            @Argument Long bID,
            @Argument Long bpId,
            @Argument Long uID,
            @Argument String proposedRole,
            @Argument String message
    ){
        return joinRequestService.inviteToBand(bID, bpId, uID, proposedRole, message);
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    public Long deleteJoinRequest(@Argument Long id){
        return joinRequestService.deleteJoinRequestById(id);
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    public Long reject(@Argument Long id){
        return joinRequestService.reject(id);
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    public Long accept(@Argument Long id, @Argument String bandRole){
        return joinRequestService.accept(id, bandRole);
    }
}
