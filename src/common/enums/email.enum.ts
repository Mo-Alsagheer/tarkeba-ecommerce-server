export enum EmailType {
    WELCOME = 'welcome',
    VERIFICATION = 'verification',
    PASSWORD_RESET = 'password_reset',
    ORDER_CONFIRMATION = 'order_confirmation',
    ORDER_SHIPPED = 'order_shipped',
    ORDER_DELIVERED = 'order_delivered',
    ORDER_CANCELLED = 'order_cancelled',
    PAYMENT_CONFIRMATION = 'payment_confirmation',
    REFUND_PROCESSED = 'refund_processed',
    NEWSLETTER = 'newsletter',
    PROMOTIONAL = 'promotional',
}

export enum EmailStatus {
    PENDING = 'pending',
    SENT = 'sent',
    DELIVERED = 'delivered',
    FAILED = 'failed',
    BOUNCED = 'bounced',
    OPENED = 'opened',
    CLICKED = 'clicked',
}

export enum EmailPriority {
    LOW = 'low',
    NORMAL = 'normal',
    HIGH = 'high',
    URGENT = 'urgent',
}
