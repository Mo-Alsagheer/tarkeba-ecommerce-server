// Base email job data
export interface BaseEmailJobData {
    to: string;
    userId?: string;
}

// Welcome email job data
export interface WelcomeEmailJobData extends BaseEmailJobData {
    username: string;
    verificationUrl?: string;
}

// Verification email job data
export interface VerificationEmailJobData extends BaseEmailJobData {
    username: string;
    otpCode: string;
    expiresInMinutes: number;
}

// Password reset email job data
export interface PasswordResetEmailJobData extends BaseEmailJobData {
    username: string;
    otpCode: string;
    expiresInMinutes: number;
}

// Order status email job data
export interface OrderStatusEmailJobData extends BaseEmailJobData {
    username: string;
    orderNumber: string;
    status: string;
    items?: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    totalPrice?: number;
    trackingNumber?: string;
    trackingUrl?: string;
    deliveryDate?: Date;
}

// Union type for all email jobs
export type EmailJobData =
    | WelcomeEmailJobData
    | VerificationEmailJobData
    | PasswordResetEmailJobData
    | OrderStatusEmailJobData;
