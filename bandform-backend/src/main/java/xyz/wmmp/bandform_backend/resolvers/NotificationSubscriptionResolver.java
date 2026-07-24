package xyz.wmmp.bandform_backend.resolvers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.autoconfigure.WebMvcProperties.Apiversion.Use;
import org.springframework.graphql.data.method.annotation.SubscriptionMapping;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.server.authorization.AuthorizationContext;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;
import xyz.wmmp.bandform_backend.data.User;
import xyz.wmmp.bandform_backend.repositories.UserRepository;
import xyz.wmmp.bandform_backend.services.UserService;
import xyz.wmmp.bandform_backend.data.Notification;
import xyz.wmmp.bandform_backend.services.NotificationPublisher;

@Controller
public class NotificationSubscriptionResolver{

  private NotificationPublisher publisher;
  private UserService userService;

  @Autowired
  public NotificationSubscriptionResolver(NotificationPublisher publisher, UserService userService){
    this.publisher = publisher;
    this.userService = userService;
  }

  @SubscriptionMapping
  public Flux<Notification> notifications(){
    Long userId = Long.parseLong((String) SecurityContextHolder.getContext().getAuthentication().getPrincipal());

    User u = userService.getUserById(userId);

    Flux<Notification> existing = Flux.fromIterable(u.getNotifications().stream().filter(n -> !n.getRead()).toList());

    Flux<Notification> live = publisher.getStream(userId);
    
    return Flux.concat(existing, live);
  }

    
}
