// Payment-related constants
export const PAYMENT_CONSTANTS = {
    CURRENCY: {
        DEFAULT: 'EGP',
        SUPPORTED: ['EGP', 'USD', 'EUR'],
        DECIMAL_PLACES: 2,
    },
    AMOUNTS: {
        MIN_PAYMENT: 1, // 1 EGP
        MAX_PAYMENT: 1000000, // 1M EGP
        REFUND_PROCESSING_FEE: 0, // No fee for refunds
    },
    TIMEOUTS: {
        PAYMENT_EXPIRY: 30 * 60 * 1000, // 30 minutes
        WEBHOOK_TIMEOUT: 30 * 1000, // 30 seconds
        REFUND_PROCESSING: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    RETRY: {
        WEBHOOK_MAX_RETRIES: 3,
        WEBHOOK_RETRY_DELAY: 5000, // 5 seconds
        PAYMENT_STATUS_CHECK_RETRIES: 5,
        PAYMENT_STATUS_CHECK_DELAY: 2000, // 2 seconds
    },
};

export const PAYMENT_MESSAGES = {
    SUCCESS: {
        PAYMENT_CREATED: 'Payment created successfully',
        PAYMENT_COMPLETED: 'Payment completed successfully',
        PAYMENT_CANCELLED: 'Payment cancelled successfully',
        REFUND_INITIATED: 'Refund initiated successfully',
        REFUND_COMPLETED: 'Refund completed successfully',
        WEBHOOK_PROCESSED: 'Webhook processed successfully',
    },
    ERROR: {
        PAYMENT_NOT_FOUND: 'Payment not found',
        PAYMENT_ALREADY_PROCESSED: 'Payment already processed',
        PAYMENT_EXPIRED: 'Payment has expired',
        PAYMENT_FAILED: 'Payment processing failed',
        INSUFFICIENT_FUNDS: 'Insufficient funds',
        INVALID_PAYMENT_METHOD: 'Invalid payment method',
        PAYMENT_DECLINED: 'Payment declined by provider',
        REFUND_NOT_ALLOWED: 'Refund not allowed for this payment',
        REFUND_AMOUNT_EXCEEDS: 'Refund amount exceeds payment amount',
        WEBHOOK_VERIFICATION_FAILED: 'Webhook signature verification failed',
        PROVIDER_ERROR: 'Payment provider error',
        NETWORK_ERROR: 'Network error occurred',
        INVALID_CURRENCY: 'Invalid currency',
        AMOUNT_TOO_LOW: 'Payment amount too low',
        AMOUNT_TOO_HIGH: 'Payment amount too high',
    },
    VALIDATION: {
        AMOUNT_REQUIRED: 'Payment amount is required',
        AMOUNT_INVALID: 'Invalid payment amount',
        CURRENCY_REQUIRED: 'Currency is required',
        METHOD_REQUIRED: 'Payment method is required',
        ORDER_ID_REQUIRED: 'Order ID is required',
        USER_ID_REQUIRED: 'User ID is required',
        PHONE_REQUIRED_FOR_WALLET: 'Phone number required for wallet payments',
        INVALID_PHONE_FORMAT: 'Invalid phone number format',
    },
};

export const PAYMENT_OPERATIONS = {
    CREATE_PAYMENT: 'Create new payment',
    GET_PAYMENT: 'Get payment details',
    GET_PAYMENTS: 'Get payment list',
    GET_USER_PAYMENTS: 'Get user payments',
    GET_ORDER_PAYMENTS: 'Get payments for order',
    UPDATE_PAYMENT: 'Update payment status',
    CANCEL_PAYMENT: 'Cancel payment',
    REFUND_PAYMENT: 'Process payment refund',
    WEBHOOK_PAYMOB: 'Process Paymob webhook',
    GET_PAYMENT_STATS: 'Get payment statistics',
    VERIFY_PAYMENT: 'Verify payment status',
    GET_PAYMENT_METHODS: 'Get available payment methods',
};

export const PAYMOB_CONSTANTS = {
    ENDPOINTS: {
        AUTH: '/auth/tokens',
        ORDERS: '/ecommerce/orders',
        PAYMENT_KEYS: '/acceptance/payment_keys',
        TRANSACTIONS: '/acceptance/transactions',
    },
    IFRAME_URL: 'https://accept.paymob.com/api/acceptance/iframes',
    WEBHOOK_EVENTS: {
        TRANSACTION_PROCESSED: 'transaction_processed',
        TRANSACTION_RESPONSE: 'transaction_response',
    },
    PAYMENT_METHODS: {
        VISA: 'visa',
        MASTERCARD: 'mastercard',
        VODAFONE_CASH: 'vodafone_cash',
        ORANGE_CASH: 'orange_cash',
        ETISALAT_CASH: 'etisalat_cash',
        WE_PAY: 'we_pay',
        BANK_TRANSFER: 'bank_transfer',
    },
    STATUS_MAPPING: {
        true: 'completed',
        false: 'failed',
        pending: 'processing',
    },
};
