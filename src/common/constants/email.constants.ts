// Email-related constants
export const EMAIL_CONSTANTS = {
    TEMPLATES: {
        WELCOME: 'welcome',
        EMAIL_VERIFICATION: 'email-verification',
        PASSWORD_RESET: 'password-reset',
        ORDER_CONFIRMATION: 'order-confirmation',
        ORDER_SHIPPED: 'order-shipped',
        ORDER_DELIVERED: 'order-delivered',
        ORDER_CANCELLED: 'order-cancelled',
        PAYMENT_CONFIRMATION: 'payment-confirmation',
        REFUND_PROCESSED: 'refund-processed',
        NEWSLETTER: 'newsletter',
        PROMOTIONAL: 'promotional',
    },
    PRIORITIES: {
        LOW: 'low',
        NORMAL: 'normal',
        HIGH: 'high',
        URGENT: 'urgent',
    },
    RETRY: {
        MAX_ATTEMPTS: 3,
        DELAY: 5000, // 5 seconds
        BACKOFF_MULTIPLIER: 2,
    },
    LIMITS: {
        MAX_RECIPIENTS: 100,
        MAX_SUBJECT_LENGTH: 255,
        MAX_BODY_LENGTH: 1000000, // 1MB
        MAX_ATTACHMENTS: 10,
        MAX_ATTACHMENT_SIZE: 25 * 1024 * 1024, // 25MB
    },
};

export const EMAIL_MESSAGES = {
    SUCCESS: {
        EMAIL_SENT: 'Email sent successfully',
        EMAIL_QUEUED: 'Email queued for sending',
        TEMPLATE_CREATED: 'Email template created successfully',
        TEMPLATE_UPDATED: 'Email template updated successfully',
        SUBSCRIPTION_UPDATED: 'Email subscription updated',
    },
    ERROR: {
        EMAIL_SEND_FAILED: 'Failed to send email',
        INVALID_EMAIL_ADDRESS: 'Invalid email address',
        TEMPLATE_NOT_FOUND: 'Email template not found',
        TEMPLATE_RENDER_ERROR: 'Failed to render email template',
        ATTACHMENT_TOO_LARGE: 'Attachment size exceeds limit',
        TOO_MANY_RECIPIENTS: 'Too many recipients',
        PROVIDER_ERROR: 'Email provider error',
        QUEUE_ERROR: 'Email queue error',
        INVALID_TEMPLATE_DATA: 'Invalid template data',
    },
    VALIDATION: {
        EMAIL_REQUIRED: 'Email address is required',
        SUBJECT_REQUIRED: 'Email subject is required',
        CONTENT_REQUIRED: 'Email content is required',
        TEMPLATE_REQUIRED: 'Email template is required',
        RECIPIENT_REQUIRED: 'At least one recipient is required',
    },
};

export const EMAIL_OPERATIONS = {
    SEND_EMAIL: 'Send email',
    QUEUE_EMAIL: 'Queue email for sending',
    GET_EMAIL_STATUS: 'Get email delivery status',
    GET_EMAIL_TEMPLATES: 'Get email templates',
    CREATE_TEMPLATE: 'Create email template',
    UPDATE_TEMPLATE: 'Update email template',
    DELETE_TEMPLATE: 'Delete email template',
    GET_EMAIL_LOGS: 'Get email logs',
    RESEND_EMAIL: 'Resend failed email',
    UPDATE_SUBSCRIPTION: 'Update email subscription preferences',
};

export const EMAIL_SUBJECTS = {
    WELCOME: 'Welcome to Tarkeba!',
    EMAIL_VERIFICATION: 'Verify your email address',
    PASSWORD_RESET: 'Reset your password',
    ORDER_CONFIRMATION: 'Order confirmation - #{orderNumber}',
    ORDER_SHIPPED: 'Your order has been shipped - #{orderNumber}',
    ORDER_DELIVERED: 'Your order has been delivered - #{orderNumber}',
    ORDER_CANCELLED: 'Order cancelled - #{orderNumber}',
    PAYMENT_CONFIRMATION: 'Payment confirmation - #{orderNumber}',
    REFUND_PROCESSED: 'Refund processed - #{orderNumber}',
    NEWSLETTER: 'Tarkeba Newsletter - {subject}',
    PROMOTIONAL: '{subject}',
};
