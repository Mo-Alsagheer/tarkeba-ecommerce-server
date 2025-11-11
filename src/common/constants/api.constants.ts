// API-related constants
export const API_CONSTANTS = {
    VERSION: 'v1',
    PREFIX: '/api/v1',
    RATE_LIMITING: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 1000, // per window
        SKIP_SUCCESSFUL_REQUESTS: false,
        SKIP_FAILED_REQUESTS: false,
    },
    CORS: {
        ORIGIN: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
        METHODS: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'],
        CREDENTIALS: true,
        MAX_AGE: 86400, // 24 hours
    },
    SECURITY: {
        HELMET_OPTIONS: {
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", 'data:', 'https:'],
                },
            },
            hsts: {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true,
            },
        },
    },
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 20,
        MAX_LIMIT: 100,
    },
    CACHE: {
        DEFAULT_TTL: 300, // 5 minutes
        LONG_TTL: 3600, // 1 hour
        SHORT_TTL: 60, // 1 minute
    },
};

export const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
};

export const API_RESPONSES = {
    SUCCESS: {
        OPERATION_SUCCESSFUL: 'Operation completed successfully',
        RESOURCE_CREATED: 'Resource created successfully',
        RESOURCE_UPDATED: 'Resource updated successfully',
        RESOURCE_DELETED: 'Resource deleted successfully',
        DATA_RETRIEVED: 'Data retrieved successfully',
    },
    ERROR: {
        INTERNAL_SERVER_ERROR: 'Internal server error occurred',
        BAD_REQUEST: 'Invalid request data',
        UNAUTHORIZED: 'Authentication required',
        FORBIDDEN: 'Access forbidden',
        NOT_FOUND: 'Resource not found',
        CONFLICT: 'Resource already exists',
        VALIDATION_ERROR: 'Validation failed',
        RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
        SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
        TIMEOUT: 'Request timeout',
        NETWORK_ERROR: 'Network error occurred',
    },
    VALIDATION: {
        INVALID_INPUT: 'Invalid input data provided',
        MISSING_REQUIRED_FIELD: 'Required field is missing',
        INVALID_FORMAT: 'Invalid data format',
        OUT_OF_RANGE: 'Value is out of acceptable range',
        DUPLICATE_VALUE: 'Duplicate value not allowed',
    },
};

export const API_TAGS = {
    AUTH: 'Authentication',
    USERS: 'Users',
    PRODUCTS: 'Products',
    CATEGORIES: 'Categories',
    ORDERS: 'Orders',
    PAYMENTS: 'Payments',
    COUPONS: 'Coupons',
    REVIEWS: 'Reviews',
    RETURNS: 'Returns & RMA',
    CART: 'Shopping Cart',
    WEBHOOKS: 'Webhooks',
    ADMIN: 'Admin',
    ANALYTICS: 'Analytics',
    NOTIFICATIONS: 'Notifications',
    FILES: 'File Management',
};

export const SWAGGER_CONFIG = {
    TITLE: 'Tarkeba E-commerce API',
    DESCRIPTION: 'A comprehensive e-commerce API built with NestJS, TypeScript, and MongoDB',
    VERSION: '1.0.0',
    CONTACT: {
        name: 'API Support',
        email: 'support@tarkeba.com',
    },
    LICENSE: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
    },
    SERVERS: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
        {
            url: 'https://api.tarkeba.com',
            description: 'Production server',
        },
    ],
};
