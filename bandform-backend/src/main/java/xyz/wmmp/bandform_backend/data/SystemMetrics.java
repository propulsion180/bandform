package xyz.wmmp.bandform_backend.data;

import java.util.List;

/**
 * Snapshot of runtime + application metrics for the admin monitoring page.
 * Component names match the GraphQL SystemMetrics type. Byte/cumulative values
 * are longs mapped onto GraphQL Float to avoid 32-bit Int overflow.
 */
public record SystemMetrics(
        // System & JVM
        double systemCpuLoad,
        double processCpuLoad,
        int availableProcessors,
        long systemMemoryTotal,
        long systemMemoryFree,
        long heapUsed,
        long heapMax,
        long nonHeapUsed,
        int threadCount,
        int peakThreadCount,
        int daemonThreadCount,
        long gcCount,
        long gcTimeMs,
        long uptimeMs,
        String startTime,
        long diskTotal,
        long diskFree,
        // Database
        boolean dbReachable,
        Integer dbPoolActive,
        Integer dbPoolIdle,
        Integer dbPoolPending,
        Integer dbPoolTotal,
        Integer dbPoolMax,
        // Traffic (since startup)
        long graphqlRequests,
        long graphqlErrors,
        double graphqlAvgLatencyMs,
        // App & Security
        int totalUsers,
        int totalBands,
        int openPositions,
        int pendingJoinRequests,
        int totalMessages,
        int activeSessions,
        int lockedAccounts,
        int usersWithFailedLogins,
        List<RecentLogin> recentLogins
) {}
