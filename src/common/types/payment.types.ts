import { PaymentProvider, PaymentMethod, PaymentStatus, TransactionType } from '../enums';
import { ObjectId } from './common.types';

export type PaymentTransaction = {
    id: ObjectId;
    orderId: ObjectId;
    userId: ObjectId;
    provider: PaymentProvider;
    method: PaymentMethod;
    status: PaymentStatus;
    amount: number;
    currency: string;
    providerTransactionId?: string;
    providerOrderId?: string;
    paymentKey?: string;
    redirectUrl?: string;
    iframeUrl?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    failureReason?: string;
};

export type PaymentWebhook = {
    provider: PaymentProvider;
    eventType: string;
    transactionId: string;
    orderId: string;
    status: PaymentStatus;
    amount: number;
    currency: string;
    signature: string;
    rawData: Record<string, any>;
    processedAt?: Date;
};

export type RefundRequest = {
    transactionId: ObjectId;
    amount: number;
    reason: string;
    requestedBy: ObjectId;
};

export type RefundResponse = {
    refundId: string;
    status: PaymentStatus;
    amount: number;
    currency: string;
    processedAt?: Date;
    failureReason?: string;
};

export type PaymentMethodInfo = {
    type: PaymentMethod;
    provider: PaymentProvider;
    displayName: string;
    isEnabled: boolean;
    requiresRedirect: boolean;
    supportedCurrencies: string[];
    processingFee?: number;
    minimumAmount?: number;
    maximumAmount?: number;
};

export type PaymentSummary = {
    totalTransactions: number;
    totalAmount: number;
    successfulTransactions: number;
    failedTransactions: number;
    refundedAmount: number;
    averageTransactionAmount: number;
};

export type PaymobConfig = {
    apiKey: string;
    baseUrl: string;
    integrationIds: {
        visa: number;
        mastercard: number;
        vodafoneCash: number;
        orangeCash: number;
        etisalatCash: number;
        wePay: number;
    };
    iframeId: number;
    hmacSecret: string;
};

export type PaymobOrderData = {
    amount_cents: number;
    currency: string;
    merchant_order_id: string;
    items: Array<{
        name: string;
        amount_cents: number;
        description: string;
        quantity: number;
    }>;
};

export type PaymobPaymentKeyRequest = {
    amount_cents: number;
    expiration: number;
    order_id: string;
    billing_data: {
        apartment?: string;
        email: string;
        floor?: string;
        first_name: string;
        street?: string;
        building?: string;
        phone_number: string;
        shipping_method?: string;
        postal_code?: string;
        city?: string;
        country?: string;
        last_name: string;
        state?: string;
    };
    currency: string;
    integration_id: number;
    lock_order_when_paid?: boolean;
};
