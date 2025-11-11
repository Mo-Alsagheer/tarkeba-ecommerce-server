import { EmailType, EmailStatus, EmailPriority } from '../enums';
import { ObjectId } from '../types';

export interface IEmailService {
    sendEmail(emailData: IEmailData): Promise<void>;
    sendWelcomeEmail(email: string, name: string): Promise<void>;
    sendVerificationEmail(email: string, token: string): Promise<void>;
    sendPasswordResetEmail(email: string, token: string): Promise<void>;
    sendOrderConfirmationEmail(email: string, orderData: any): Promise<void>;
    sendOrderStatusUpdateEmail(email: string, orderData: any, status: string): Promise<void>;
    sendPaymentConfirmationEmail(email: string, paymentData: any): Promise<void>;
    sendRefundNotificationEmail(email: string, refundData: any): Promise<void>;
    queueEmail(emailData: IEmailData): Promise<void>;
}

export interface IEmailData {
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    template?: string;
    html?: string;
    text?: string;
    data?: Record<string, any>;
    attachments?: IEmailAttachment[];
    priority?: EmailPriority;
    type: EmailType;
    userId?: ObjectId;
    orderId?: ObjectId;
    metadata?: Record<string, any>;
}

export interface IEmailAttachment {
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
    cid?: string;
}

export interface IEmailTemplate {
    id: ObjectId;
    name: string;
    type: EmailType;
    subject: string;
    htmlTemplate: string;
    textTemplate?: string;
    variables: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IEmailLog {
    id: ObjectId;
    to: string;
    subject: string;
    type: EmailType;
    status: EmailStatus;
    provider: string;
    providerId?: string;
    errorMessage?: string;
    sentAt?: Date;
    deliveredAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    bouncedAt?: Date;
    userId?: ObjectId;
    orderId?: ObjectId;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export interface IEmailProvider {
    name: string;
    sendEmail(emailData: IEmailData): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    verifyConfiguration(): Promise<boolean>;
}

export interface IEmailQueue {
    addEmailJob(
        emailData: IEmailData,
        options?: {
            delay?: number;
            attempts?: number;
            priority?: number;
        }
    ): Promise<void>;
    processEmailJob(jobData: IEmailData): Promise<void>;
    retryFailedEmails(): Promise<void>;
    getQueueStats(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
    }>;
}
