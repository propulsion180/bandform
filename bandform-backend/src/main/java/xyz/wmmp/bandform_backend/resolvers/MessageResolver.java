package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.Message;
import xyz.wmmp.bandform_backend.services.BandAuthorizationService;
import xyz.wmmp.bandform_backend.services.BandService;
import xyz.wmmp.bandform_backend.services.MessagePublisher;
import xyz.wmmp.bandform_backend.services.MessageService;

import java.util.List;

@Controller
public class MessageResolver {
    private final MessageService messageService;
    private final BandService bandService;
    private final BandAuthorizationService bandAuthorizationService;
    private final MessagePublisher messagePublisher;

    @Autowired
    public MessageResolver(MessageService messageService, BandService bandService, BandAuthorizationService bandAuthorizationService, MessagePublisher messagePublisher){
        this.messageService = messageService;
        this.bandService = bandService;
        this.bandAuthorizationService = bandAuthorizationService;
        this.messagePublisher = messagePublisher;
    }

    @PreAuthorize("isAuthenticated()")
    @QueryMapping
    public List<Message> bandMessages(@Argument Long bandId, @Argument Integer limit, @Argument Long before){
        bandAuthorizationService.requireBandMember(bandService.getBandById(bandId));
        return messageService.getBandMessages(bandId, limit, before);
    }

    @PreAuthorize("isAuthenticated()")
    @MutationMapping
    public Message sendMessage(@Argument Long bandId, @Argument String body){
        Band band = bandService.getBandById(bandId);
        bandAuthorizationService.requireBandMember(band);
        Message message = messageService.sendMessage(bandId, bandAuthorizationService.currentUserId(), body);
        messagePublisher.publish(bandId, message);
        return message;
    }
}
