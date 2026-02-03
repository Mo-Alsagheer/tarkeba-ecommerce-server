import { QueueOptions } from 'bullmq';

// Queue names
export const QUEUE_NAMES = {
    WELCOME_EMAIL: 'welcome-email-queue',
    VERIFICATION_EMAIL: 'verification-email-queue',
    PASSWORD_RESET: 'password-reset-queue',
    ORDER_STATUS: 'order-status-queue',
} as const;

// Redis configuration
export const getRedisConfig = (): any => {
    // If a full REDIS_URL is provided (typical for Railway/Heroku)
    if (process.env.REDIS_URL) {
        try {
            const url = new URL(process.env.REDIS_URL);
            return {
                host: url.hostname,
                port: parseInt(url.port || '6379', 10),
                password: url.password || undefined,
                username: url.username || undefined,
                maxRetriesPerRequest: null,
                enableReadyCheck: false,
            };
        } catch (e) {
            // If URL parsing fails, fallback to individual vars or defaults
            console.error('Failed to parse REDIS_URL, falling back to components');
        }
    }

    return {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    };
};

// Queue options with retry and rate limiting
export const getQueueOptions = (queueName: string): QueueOptions => ({
    connection: getRedisConfig(),
    defaultJobOptions: {
        attempts: 3, // Retry up to 3 times
        backoff: {
            type: 'exponential',
            delay: 2000, // Start with 2 seconds, then 4s, 8s
        },
        removeOnComplete: {
            count: 100, // Keep last 100 completed jobs
            age: 24 * 3600, // Remove after 24 hours
        },
        removeOnFail: {
            count: 1000, // Keep last 1000 failed jobs
        },
    },
});

// Worker options with concurrency
export const getWorkerOptions = () => ({
    connection: getRedisConfig(),
    concurrency: 5, // Process 5 jobs simultaneously
    limiter: {
        max: 10, // Max 10 jobs
        duration: 60000, // Per 60 seconds (1 minute)
    },
});

// Job priorities
export enum EmailPriority {
    LOW = 1,
    NORMAL = 5,
    HIGH = 10,
    CRITICAL = 20,
}
