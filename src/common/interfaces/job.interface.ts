export interface BaseJobData {
    id?: string;
    userId?: string;
    timestamp?: Date;
    metadata?: Record<string, any>;
}

export interface EmailJobData extends BaseJobData {
    to: string;
    subject: string;
    template?: string;
    data?: Record<string, any>;
}

export interface PasswordResetJobData extends EmailJobData {
    resetToken: string;
    userName?: string;
}

export interface VerificationJobData extends EmailJobData {
    verificationToken: string;
    userName?: string;
}

export interface NotificationJobData extends BaseJobData {
    type: 'order_status' | 'payment_success' | 'payment_failed' | 'welcome';
    recipient: string;
    data: Record<string, any>;
}

export interface PaymentJobData extends BaseJobData {
    orderId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
}

export interface AnalyticsJobData extends BaseJobData {
    event: string;
    properties: Record<string, any>;
}

export type JobData =
    | EmailJobData
    | PasswordResetJobData
    | VerificationJobData
    | NotificationJobData
    | PaymentJobData
    | AnalyticsJobData;
