package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SubscriptionMapping;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;
import xyz.wmmp.bandform_backend.data.Notification;
import xyz.wmmp.bandform_backend.services.NotificationPublisher;
import xyz.wmmp.bandform_backend.services.NotificationService;
import xyz.wmmp.bandform_backend.services.WsTicketService;

/**
 * Authenticates over a short-lived, single-use ticket (see WsTicketService),
 * same as MessageSubscriptionResolver -- the WS handshake carries no
 * authenticated principal, so SecurityContextHolder can't be used here.
 *
 * Unread history is fetched via a direct repository query
 * (NotificationService.getUnreadNotifications) rather than by traversing
 * User.notifications -- that's a lazy JPA collection, and this subscription
 * runs outside any HTTP request/view session, so touching it here throws
 * LazyInitializationException.
 */
@Controller
public class NotificationSubscriptionResolver{

  private final NotificationPublisher publisher;
  private final NotificationService notificationService;
  private final WsTicketService wsTicketService;

  @Autowired
  public NotificationSubscriptionResolver(NotificationPublisher publisher, NotificationService notificationService, WsTicketService wsTicketService){
    this.publisher = publisher;
    this.notificationService = notificationService;
    this.wsTicketService = wsTicketService;
  }

  @SubscriptionMapping
  public Flux<Notification> notifications(@Argument String ticket){
    Long userId = wsTicketService.redeem(ticket)
            .orElseThrow(() -> new AccessDeniedException("Invalid or expired connection ticket."));

    Flux<Notification> existing = Flux.fromIterable(notificationService.getUnreadNotifications(userId));

    Flux<Notification> live = publisher.getStream(userId);

    return Flux.concat(existing, live);
  }


}
