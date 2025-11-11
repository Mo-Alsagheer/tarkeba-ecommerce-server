export type ApiResponse<T = any> = {
    success: boolean;
    message: string;
    data?: T;
    errors?: string[];
    timestamp: string;
    path: string;
    statusCode: number;
};

export type ApiError = {
    success: false;
    message: string;
    errors: string[];
    timestamp: string;
    path: string;
    statusCode: number;
    stack?: string;
};

export type ValidationError = {
    field: string;
    message: string;
    value?: any;
    constraints?: Record<string, string>;
};

export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};

export type ApiListResponse<T = any> = {
    success: boolean;
    message: string;
    data: T[];
    meta: PaginationMeta;
    timestamp: string;
    path: string;
    statusCode: number;
};

export type FileUploadResponse = {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    path: string;
};

export type BulkOperationResponse = {
    success: boolean;
    processed: number;
    succeeded: number;
    failed: number;
    errors: Array<{
        index: number;
        error: string;
    }>;
};

export type HealthCheckResponse = {
    status: 'ok' | 'error';
    timestamp: string;
    uptime: number;
    version: string;
    services: Record<
        string,
        {
            status: 'up' | 'down';
            responseTime?: number;
            error?: string;
        }
    >;
};
