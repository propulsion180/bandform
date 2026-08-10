package xyz.wmmp.bandform_backend.services;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import xyz.wmmp.bandform_backend.data.Message;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Flux;
import reactor.util.concurrent.Queues;

@Service
public class MessagePublisher {
  private final Map<Long, Sinks.Many<Message>> bandSinks = new ConcurrentHashMap<>();

  public Flux<Message> getStream(Long bandId){
    // autoCancel=false: the default onBackpressureBuffer() shuts a sink down
    // permanently once its subscriber count first hits zero, which happens
    // routinely here (e.g. everyone closes a band's Chat tab). This channel
    // needs to stay alive for the life of the server, not a subscriber.
    return bandSinks.computeIfAbsent(bandId, id -> Sinks.many().multicast().onBackpressureBuffer(Queues.SMALL_BUFFER_SIZE, false)).asFlux();
  }

  public void publish(Long bandId, Message message){
    Sinks.Many<Message> sink = bandSinks.get(bandId);
    if(sink != null){
      sink.tryEmitNext(message);
    }
  }

}
