package xyz.wmmp.bandform_backend.services;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import xyz.wmmp.bandform_backend.data.Notification;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Flux;
import reactor.util.concurrent.Queues;

@Service
public class NotificationPublisher {
  private final Map<Long, Sinks.Many<Notification>> userSinks = new ConcurrentHashMap<>();

  public Flux<Notification> getStream(Long userId){
    // autoCancel=false: see MessagePublisher.getStream() for why the default
    // (true) is wrong for a long-lived per-user channel.
    return userSinks.computeIfAbsent(userId, id -> Sinks.many().multicast().onBackpressureBuffer(Queues.SMALL_BUFFER_SIZE, false)).asFlux();
  }

  public void publish(Long userId, Notification notification){
    Sinks.Many<Notification> sink = userSinks.get(userId);
    if(sink != null){
      sink.tryEmitNext(notification);
    }
  }

}
