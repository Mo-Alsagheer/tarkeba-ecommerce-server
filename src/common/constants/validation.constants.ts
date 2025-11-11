// Validation constants
export const VALIDATION_CONSTANTS = {
    USER: {
        EMAIL: {
            MIN_LENGTH: 5,
            MAX_LENGTH: 254,
            REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        PASSWORD: {
            MIN_LENGTH: 8,
            MAX_LENGTH: 128,
            REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        },
        NAME: {
            MIN_LENGTH: 2,
            MAX_LENGTH: 50,
            REGEX: /^[a-zA-Z\s\u0600-\u06FF]+$/,
        },
        PHONE: {
            REGEX: /^\+?[1-9]\d{1,14}$/,
        },
    },
    PRODUCT: {
        NAME: {
            MIN_LENGTH: 3,
            MAX_LENGTH: 255,
        },
        DESCRIPTION: {
            MIN_LENGTH: 10,
            MAX_LENGTH: 5000,
        },
        SKU: {
            MIN_LENGTH: 3,
            MAX_LENGTH: 50,
            REGEX: /^[A-Z0-9-_]+$/,
        },
        PRICE: {
            MIN: 0.01,
            MAX: 1000000,
            DECIMAL_PLACES: 2,
        },
        WEIGHT: {
            MIN: 0.001,
            MAX: 1000,
        },
        DIMENSIONS: {
            MIN: 0.1,
            MAX: 1000,
        },
    },
    ORDER: {
        ORDER_NUMBER: {
            REGEX: /^ORD\d{9}$/,
        },
        NOTES: {
            MAX_LENGTH: 1000,
        },
        QUANTITY: {
            MIN: 1,
            MAX: 999,
        },
    },
    CATEGORY: {
        NAME: {
            MIN_LENGTH: 2,
            MAX_LENGTH: 100,
        },
        DESCRIPTION: {
            MAX_LENGTH: 500,
        },
        SLUG: {
            REGEX: /^[a-z0-9-]+$/,
        },
    },
    COUPON: {
        CODE: {
            MIN_LENGTH: 3,
            MAX_LENGTH: 20,
            REGEX: /^[A-Z0-9-_]+$/,
        },
        DISCOUNT: {
            MIN_PERCENTAGE: 1,
            MAX_PERCENTAGE: 100,
            MIN_AMOUNT: 0.01,
            MAX_AMOUNT: 10000,
        },
        USAGE: {
            MIN_LIMIT: 1,
            MAX_LIMIT: 100000,
        },
    },
    REVIEW: {
        TITLE: {
            MIN_LENGTH: 5,
            MAX_LENGTH: 100,
        },
        CONTENT: {
            MIN_LENGTH: 10,
            MAX_LENGTH: 2000,
        },
        RATING: {
            MIN: 1,
            MAX: 5,
        },
    },
    FILE: {
        IMAGE: {
            MAX_SIZE: 5 * 1024 * 1024, // 5MB
            ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
            MAX_WIDTH: 2048,
            MAX_HEIGHT: 2048,
        },
        DOCUMENT: {
            MAX_SIZE: 10 * 1024 * 1024, // 10MB
            ALLOWED_TYPES: [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ],
        },
    },
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 20,
        MAX_LIMIT: 100,
        MIN_LIMIT: 1,
    },
};

export const VALIDATION_MESSAGES = {
    COMMON: {
        REQUIRED: '{field} is required',
        INVALID_FORMAT: 'Invalid {field} format',
        TOO_SHORT: '{field} must be at least {min} characters long',
        TOO_LONG: '{field} must not exceed {max} characters',
        INVALID_TYPE: '{field} must be a {type}',
        OUT_OF_RANGE: '{field} must be between {min} and {max}',
        ALREADY_EXISTS: '{field} already exists',
        NOT_FOUND: '{field} not found',
        INVALID_ID: 'Invalid {field} ID',
    },
    USER: {
        EMAIL_INVALID: 'Invalid email address format',
        EMAIL_EXISTS: 'Email address already exists',
        PASSWORD_WEAK:
            'Password must contain uppercase, lowercase, numbers, and special characters',
        PHONE_INVALID: 'Invalid phone number format',
        NAME_INVALID: 'Name can only contain letters and spaces',
    },
    PRODUCT: {
        SKU_INVALID: 'SKU can only contain uppercase letters, numbers, hyphens, and underscores',
        PRICE_INVALID: 'Price must be a positive number',
        WEIGHT_INVALID: 'Weight must be a positive number',
        STOCK_INSUFFICIENT: 'Insufficient stock available',
    },
    ORDER: {
        ORDER_NUMBER_INVALID: 'Invalid order number format',
        QUANTITY_INVALID: 'Quantity must be a positive integer',
        EMPTY_CART: 'Cart cannot be empty',
    },
    FILE: {
        SIZE_TOO_LARGE: 'File size exceeds maximum limit of {maxSize}',
        INVALID_TYPE: 'File type not allowed. Allowed types: {allowedTypes}',
        DIMENSIONS_TOO_LARGE: 'Image dimensions exceed maximum of {maxWidth}x{maxHeight}',
    },
};
