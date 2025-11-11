export enum PaymentProvider {
    PAYMOB = 'paymob',
    STRIPE = 'stripe',
    PAYPAL = 'paypal',
}

export enum PaymentMethod {
    VISA = 'visa',
    MASTERCARD = 'mastercard',
    VODAFONE_CASH = 'vodafone_cash',
    ORANGE_CASH = 'orange_cash',
    ETISALAT_CASH = 'etisalat_cash',
    WE_PAY = 'we_pay',
    BANK_TRANSFER = 'bank_transfer',
    CASH_ON_DELIVERY = 'cash_on_delivery',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
    PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum TransactionType {
    PAYMENT = 'payment',
    REFUND = 'refund',
    CHARGEBACK = 'chargeback',
}

export enum RefundStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
}
