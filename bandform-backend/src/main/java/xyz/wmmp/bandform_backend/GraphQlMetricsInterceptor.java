package xyz.wmmp.bandform_backend;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.graphql.server.WebGraphQlInterceptor;
import org.springframework.graphql.server.WebGraphQlRequest;
import org.springframework.graphql.server.WebGraphQlResponse;
import org.springframework.stereotype.Component;

import reactor.core.publisher.Mono;

/**
 * Lightweight, in-memory traffic counters for the admin monitoring page. Counts
 * every GraphQL request, how many produced errors, and cumulative handling time
 * (for an average latency). State is process-local and resets on restart -- this
 * is a self-monitoring convenience, not a durable metrics store. Read via
 * MonitoringResolver.systemMetrics.
 */
@Component
public class GraphQlMetricsInterceptor implements WebGraphQlInterceptor {

    private final AtomicLong requests = new AtomicLong();
    private final AtomicLong errors = new AtomicLong();
    private final AtomicLong totalNanos = new AtomicLong();

    @Override
    public Mono<WebGraphQlResponse> intercept(WebGraphQlRequest request, Chain chain) {
        long start = System.nanoTime();
        return chain.next(request).doOnNext(response -> {
            requests.incrementAndGet();
            totalNanos.addAndGet(System.nanoTime() - start);
            if (response.getErrors() != null && !response.getErrors().isEmpty()) {
                errors.incrementAndGet();
            }
        });
    }

    public long getRequestCount() {
        return requests.get();
    }

    public long getErrorCount() {
        return errors.get();
    }

    public double getAverageLatencyMs() {
        long count = requests.get();
        if (count == 0) {
            return 0.0;
        }
        return (totalNanos.get() / (double) count) / 1_000_000.0;
    }
}
