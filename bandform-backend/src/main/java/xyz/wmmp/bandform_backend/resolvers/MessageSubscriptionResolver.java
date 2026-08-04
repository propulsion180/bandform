package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SubscriptionMapping;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;
import xyz.wmmp.bandform_backend.data.Band;
import xyz.wmmp.bandform_backend.data.Message;
import xyz.wmmp.bandform_backend.services.BandAuthorizationService;
import xyz.wmmp.bandform_backend.services.BandService;
import xyz.wmmp.bandform_backend.services.MessagePublisher;
import xyz.wmmp.bandform_backend.services.WsTicketService;

/**
 * Authenticates over a short-lived, single-use ticket (see WsTicketService)
 * passed as a plain subscription argument, rather than relying on the
 * session cookie/SecurityContextHolder -- browsers have long-documented,
 * inconsistent behavior attaching SameSite cookies to WebSocket handshakes
 * when the port differs from the page's origin, so the cookie can't be
 * trusted to arrive here.
 */
@Controller
public class MessageSubscriptionResolver {

    private final MessagePublisher messagePublisher;
    private final BandService bandService;
    private final BandAuthorizationService bandAuthorizationService;
    private final WsTicketService wsTicketService;

    @Autowired
    public MessageSubscriptionResolver(MessagePublisher messagePublisher, BandService bandService, BandAuthorizationService bandAuthorizationService, WsTicketService wsTicketService){
        this.messagePublisher = messagePublisher;
        this.bandService = bandService;
        this.bandAuthorizationService = bandAuthorizationService;
        this.wsTicketService = wsTicketService;
    }

    @SubscriptionMapping
    public Flux<Message> messageAdded(@Argument Long bandId, @Argument String ticket){
        Long userId = wsTicketService.redeem(ticket)
                .orElseThrow(() -> new AccessDeniedException("Invalid or expired connection ticket."));
        Band band = bandService.getBandById(bandId);
        bandAuthorizationService.requireBandMember(band, userId);
        return messagePublisher.getStream(bandId);
    }
}
