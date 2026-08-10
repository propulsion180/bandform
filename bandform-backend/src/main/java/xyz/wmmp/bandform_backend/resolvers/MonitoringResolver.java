package xyz.wmmp.bandform_backend.resolvers;

import java.io.File;
import java.lang.management.GarbageCollectorMXBean;
import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.RuntimeMXBean;
import java.lang.management.ThreadMXBean;
import java.sql.Connection;
import java.time.Instant;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import com.zaxxer.hikari.HikariDataSource;
import com.zaxxer.hikari.HikariPoolMXBean;

import xyz.wmmp.bandform_backend.GraphQlMetricsInterceptor;
import xyz.wmmp.bandform_backend.data.RecentLogin;
import xyz.wmmp.bandform_backend.data.RequestStatus;
import xyz.wmmp.bandform_backend.data.SystemMetrics;
import xyz.wmmp.bandform_backend.repositories.BandPositionRepository;
import xyz.wmmp.bandform_backend.repositories.BandRepository;
import xyz.wmmp.bandform_backend.repositories.JoinRequestRepository;
import xyz.wmmp.bandform_backend.repositories.MessageRepository;
import xyz.wmmp.bandform_backend.repositories.UserRepository;

/**
 * Admin-only self-monitoring: assembles a SystemMetrics snapshot from JVM/OS
 * MXBeans, the Hikari connection pool, the in-app GraphQL traffic counters, and
 * repository counts -- no external monitoring stack or extra dependencies.
 */
@Controller
public class MonitoringResolver {

    private final DataSource dataSource;
    private final GraphQlMetricsInterceptor metrics;
    private final UserRepository userRepository;
    private final BandRepository bandRepository;
    private final BandPositionRepository bandPositionRepository;
    private final JoinRequestRepository joinRequestRepository;
    private final MessageRepository messageRepository;

    public MonitoringResolver(DataSource dataSource,
                              GraphQlMetricsInterceptor metrics,
                              UserRepository userRepository,
                              BandRepository bandRepository,
                              BandPositionRepository bandPositionRepository,
                              JoinRequestRepository joinRequestRepository,
                              MessageRepository messageRepository) {
        this.dataSource = dataSource;
        this.metrics = metrics;
        this.userRepository = userRepository;
        this.bandRepository = bandRepository;
        this.bandPositionRepository = bandPositionRepository;
        this.joinRequestRepository = joinRequestRepository;
        this.messageRepository = messageRepository;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    @QueryMapping
    public SystemMetrics systemMetrics() {
        // --- System & JVM ---
        java.lang.management.OperatingSystemMXBean osBase = ManagementFactory.getOperatingSystemMXBean();
        double systemCpuLoad = -1.0;
        double processCpuLoad = -1.0;
        long systemMemoryTotal = 0;
        long systemMemoryFree = 0;
        if (osBase instanceof com.sun.management.OperatingSystemMXBean os) {
            systemCpuLoad = os.getCpuLoad();
            processCpuLoad = os.getProcessCpuLoad();
            systemMemoryTotal = os.getTotalMemorySize();
            systemMemoryFree = os.getFreeMemorySize();
        }
        int availableProcessors = osBase.getAvailableProcessors();

        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        long heapUsed = memoryBean.getHeapMemoryUsage().getUsed();
        long heapMax = memoryBean.getHeapMemoryUsage().getMax();
        long nonHeapUsed = memoryBean.getNonHeapMemoryUsage().getUsed();

        ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();
        int threadCount = threadBean.getThreadCount();
        int peakThreadCount = threadBean.getPeakThreadCount();
        int daemonThreadCount = threadBean.getDaemonThreadCount();

        long gcCount = 0;
        long gcTimeMs = 0;
        for (GarbageCollectorMXBean gc : ManagementFactory.getGarbageCollectorMXBeans()) {
            long c = gc.getCollectionCount();
            if (c > 0) {
                gcCount += c;
            }
            long t = gc.getCollectionTime();
            if (t > 0) {
                gcTimeMs += t;
            }
        }

        RuntimeMXBean runtimeBean = ManagementFactory.getRuntimeMXBean();
        long uptimeMs = runtimeBean.getUptime();
        String startTime = Instant.ofEpochMilli(runtimeBean.getStartTime()).toString();

        File root = new File(".");
        long diskTotal = root.getTotalSpace();
        long diskFree = root.getUsableSpace();

        // --- Database ---
        boolean dbReachable;
        try (Connection connection = dataSource.getConnection()) {
            dbReachable = connection.isValid(1);
        } catch (Exception e) {
            dbReachable = false;
        }
        Integer dbPoolActive = null;
        Integer dbPoolIdle = null;
        Integer dbPoolPending = null;
        Integer dbPoolTotal = null;
        Integer dbPoolMax = null;
        if (dataSource instanceof HikariDataSource hikari) {
            HikariPoolMXBean pool = hikari.getHikariPoolMXBean();
            if (pool != null) {
                dbPoolActive = pool.getActiveConnections();
                dbPoolIdle = pool.getIdleConnections();
                dbPoolPending = pool.getThreadsAwaitingConnection();
                dbPoolTotal = pool.getTotalConnections();
            }
            dbPoolMax = hikari.getMaximumPoolSize();
        }

        // --- Traffic ---
        long graphqlRequests = metrics.getRequestCount();
        long graphqlErrors = metrics.getErrorCount();
        double graphqlAvgLatencyMs = metrics.getAverageLatencyMs();

        // --- App & Security ---
        int totalUsers = (int) userRepository.count();
        int totalBands = (int) bandRepository.count();
        int openPositions = (int) bandPositionRepository.countByFilledFalse();
        int pendingJoinRequests = (int) joinRequestRepository.countByStatus(RequestStatus.PENDING);
        int totalMessages = (int) messageRepository.count();
        int activeSessions = (int) userRepository.countByJtiTokenIsNotNullAndTokenExpiryAfter(Instant.now());
        int lockedAccounts = (int) userRepository.countByLockedTrue();
        int usersWithFailedLogins = (int) userRepository.countByFailedLoginAttemptsGreaterThan(0);
        List<RecentLogin> recentLogins = userRepository
                .findTop10ByLastLoginAtIsNotNullOrderByLastLoginAtDesc()
                .stream()
                .map(RecentLogin::from)
                .toList();

        return new SystemMetrics(
                systemCpuLoad, processCpuLoad, availableProcessors,
                systemMemoryTotal, systemMemoryFree,
                heapUsed, heapMax, nonHeapUsed,
                threadCount, peakThreadCount, daemonThreadCount,
                gcCount, gcTimeMs, uptimeMs, startTime,
                diskTotal, diskFree,
                dbReachable, dbPoolActive, dbPoolIdle, dbPoolPending, dbPoolTotal, dbPoolMax,
                graphqlRequests, graphqlErrors, graphqlAvgLatencyMs,
                totalUsers, totalBands, openPositions, pendingJoinRequests, totalMessages,
                activeSessions, lockedAccounts, usersWithFailedLogins,
                recentLogins
        );
    }
}
