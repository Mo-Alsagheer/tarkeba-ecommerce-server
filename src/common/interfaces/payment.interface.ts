import { PaymentProvider, PaymentMethod, PaymentStatus } from '../enums';
import { ObjectId, PaginatedResponse, SearchQuery } from '../types';

export interface IPayment {
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
    failureReason?: string;
    refundedAmount?: number;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
}

export interface IPaymentService {
    create(paymentData: Partial<IPayment>): Promise<IPayment>;
    findById(id: string): Promise<IPayment | null>;
    update(id: string, updateData: Partial<IPayment>): Promise<IPayment>;
    findAll(query?: SearchQuery): Promise<PaginatedResponse<IPayment>>;
    findByOrderId(orderId: string): Promise<IPayment[]>;
    findByUserId(userId: string, query?: SearchQuery): Promise<PaginatedResponse<IPayment>>;
    processWebhook(webhookData: any): Promise<void>;
    refund(id: string, amount?: number, reason?: string): Promise<IPayment>;
    getStats(): Promise<any>;
    updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<void>;
}

export interface IPaymentProvider {
    name: PaymentProvider;
    createPayment(paymentData: any): Promise<any>;
    verifyWebhook(signature: string, payload: any): boolean;
    processRefund(transactionId: string, amount: number): Promise<any>;
    getTransactionDetails(transactionId: string): Promise<any>;
}

export interface IPaymobService extends IPaymentProvider {
    getAuthToken(): Promise<string>;
    createOrder(orderData: any): Promise<any>;
    createPaymentKey(paymentKeyData: any): Promise<string>;
    initiatePayment(
        orderId: string,
        amount: number,
        paymentMethod: PaymentMethod,
        userEmail: string,
        userPhone: string,
        userName: string,
        walletMsisdn?: string
    ): Promise<{
        paymobOrderId: string;
        paymentKey: string;
        redirectUrl?: string;
        iframeUrl?: string;
    }>;
    verifyHmacSignature(
        amount: string,
        created_at: string,
        currency: string,
        error_occured: string,
        has_parent_transaction: string,
        id: string,
        integration_id: string,
        is_3d_secure: string,
        is_auth: string,
        is_capture: string,
        is_refunded: string,
        is_standalone_payment: string,
        is_voided: string,
        order: string,
        owner: string,
        pending: string,
        source_data_pan: string,
        source_data_sub_type: string,
        source_data_type: string,
        success: string,
        receivedHmac: string
    ): boolean;
}

export interface IPaymentRepository {
    create(paymentData: Partial<IPayment>): Promise<IPayment>;
    findById(id: string): Promise<IPayment | null>;
    update(id: string, updateData: Partial<IPayment>): Promise<IPayment>;
    findMany(query: any, options?: any): Promise<IPayment[]>;
    count(query?: any): Promise<number>;
    findByOrderId(orderId: string): Promise<IPayment[]>;
    findByUserId(userId: string, options?: any): Promise<IPayment[]>;
}

export interface IWebhookPayload {
    provider: PaymentProvider;
    eventType: string;
    transactionId: string;
    orderId: string;
    status: PaymentStatus;
    amount: number;
    currency: string;
    signature: string;
    rawData: Record<string, any>;
}
