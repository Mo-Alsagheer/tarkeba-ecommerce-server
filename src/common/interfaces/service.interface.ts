import { ObjectId, PaginatedResponse, PaginationQuery } from '../types';

export interface IBaseService<T> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findAll(query?: PaginationQuery): Promise<PaginatedResponse<T>>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string): Promise<void>;
    count(query?: any): Promise<number>;
}

export interface IValidationService {
    validateEmail(email: string): boolean;
    validatePassword(password: string): { valid: boolean; errors: string[] };
    validatePhone(phone: string): boolean;
    sanitizeInput(input: string): string;
    validateObjectId(id: string): boolean;
}

export interface IHashingService {
    hash(plainText: string): Promise<string>;
    compare(plainText: string, hash: string): Promise<boolean>;
    generateSalt(rounds?: number): Promise<string>;
}

export interface IFileUploadService {
    uploadSingle(file: any, options?: IUploadOptions): Promise<IUploadResult>;
    uploadMultiple(files: any[], options?: IUploadOptions): Promise<IUploadResult[]>;
    deleteFile(fileUrl: string): Promise<boolean>;
    generateSignedUrl(fileKey: string, expiresIn?: number): Promise<string>;
    validateFile(file: any, options?: IUploadOptions): { valid: boolean; errors: string[] };
}

export interface IUploadOptions {
    maxSize?: number;
    allowedMimeTypes?: string[];
    folder?: string;
    generateThumbnail?: boolean;
    quality?: number;
    resize?: {
        width: number;
        height: number;
        fit?: 'cover' | 'contain' | 'fill';
    };
}

export interface IUploadResult {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    path: string;
    thumbnailUrl?: string;
}

export interface INotificationService {
    sendPushNotification(userId: ObjectId, notification: IPushNotification): Promise<void>;
    sendSMSNotification(phone: string, message: string): Promise<void>;
    sendEmailNotification(email: string, notification: IEmailNotification): Promise<void>;
    createInAppNotification(userId: ObjectId, notification: IInAppNotification): Promise<void>;
    markAsRead(notificationId: ObjectId, userId: ObjectId): Promise<void>;
    getUnreadCount(userId: ObjectId): Promise<number>;
}

export interface IPushNotification {
    title: string;
    body: string;
    data?: Record<string, any>;
    badge?: number;
    sound?: string;
    icon?: string;
    image?: string;
    clickAction?: string;
}

export interface IEmailNotification {
    subject: string;
    template: string;
    data: Record<string, any>;
    priority?: 'low' | 'normal' | 'high';
}

export interface IInAppNotification {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    actionUrl?: string;
    actionText?: string;
    data?: Record<string, any>;
}

export interface IAnalyticsService {
    trackEvent(event: IAnalyticsEvent): Promise<void>;
    trackPageView(userId: ObjectId, page: string, metadata?: Record<string, any>): Promise<void>;
    trackUserAction(
        userId: ObjectId,
        action: string,
        metadata?: Record<string, any>
    ): Promise<void>;
    getAnalytics(query: IAnalyticsQuery): Promise<IAnalyticsResult>;
}

export interface IAnalyticsEvent {
    userId?: ObjectId;
    event: string;
    properties?: Record<string, any>;
    timestamp?: Date;
    sessionId?: string;
    deviceInfo?: {
        userAgent: string;
        ip: string;
        country?: string;
        city?: string;
    };
}

export interface IAnalyticsQuery {
    startDate: Date;
    endDate: Date;
    events?: string[];
    userId?: ObjectId;
    groupBy?: 'day' | 'week' | 'month';
    filters?: Record<string, any>;
}

export interface IAnalyticsResult {
    totalEvents: number;
    uniqueUsers: number;
    data: Array<{
        date: string;
        count: number;
        uniqueUsers: number;
    }>;
    topEvents: Array<{
        event: string;
        count: number;
    }>;
}
