package xyz.wmmp.bandform_backend.services;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Short-lived, single-use tickets used to authenticate GraphQL WebSocket
 * subscriptions. Browsers have long-documented, inconsistent behavior
 * attaching SameSite cookies to WebSocket handshakes when the port differs
 * from the page's origin, so the session cookie can't be relied on there.
 * A ticket is minted over the (cookie-authenticated) HTTP link and passed
 * as a plain subscription argument instead. In-process only, same accepted
 * limitation as MessagePublisher/NotificationPublisher.
 */
@Service
public class WsTicketService {
    private static final Duration TTL = Duration.ofSeconds(30);

    private record Ticket(Long userId, Instant expiresAt) {}

    private final Map<String, Ticket> tickets = new ConcurrentHashMap<>();

    public String issue(Long userId) {
        String ticket = UUID.randomUUID().toString();
        tickets.put(ticket, new Ticket(userId, Instant.now().plus(TTL)));
        return ticket;
    }

    public Optional<Long> redeem(String ticket) {
        Ticket t = tickets.remove(ticket);
        if (t == null || Instant.now().isAfter(t.expiresAt())) {
            return Optional.empty();
        }
        return Optional.of(t.userId());
    }
}
