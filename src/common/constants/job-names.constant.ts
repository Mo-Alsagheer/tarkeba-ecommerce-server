export const JOB_NAMES = {
    // Email jobs
    EMAIL: {
        SEND_PASSWORD_RESET: 'email:send-password-reset',
        SEND_VERIFICATION: 'email:send-verification',
        SEND_WELCOME: 'email:send-welcome',
        SEND_ORDER_CONFIRMATION: 'email:send-order-confirmation',
        SEND_ORDER_STATUS_UPDATE: 'email:send-order-status-update',
    },

    // Notification jobs
    NOTIFICATION: {
        PUSH_NOTIFICATION: 'notification:push',
        SMS_NOTIFICATION: 'notification:sms',
    },

    // Payment jobs
    PAYMENT: {
        PROCESS_PAYMENT: 'payment:process',
        PROCESS_REFUND: 'payment:refund',
        VERIFY_WEBHOOK: 'payment:verify-webhook',
    },

    // Analytics jobs
    ANALYTICS: {
        TRACK_EVENT: 'analytics:track-event',
        GENERATE_REPORT: 'analytics:generate-report',
    },
} as const;

export type JobName =
    (typeof JOB_NAMES)[keyof typeof JOB_NAMES][keyof (typeof JOB_NAMES)[keyof typeof JOB_NAMES]];
