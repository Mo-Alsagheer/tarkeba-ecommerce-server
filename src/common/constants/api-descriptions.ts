// API Property descriptions for Swagger documentation
export const API_DESCRIPTIONS = {
    // Auth related descriptions
    AUTH: {
        EMAIL: 'User email address',
        PASSWORD: 'User password',
        USERNAME: 'User name',
        CONFIRM_PASSWORD: 'Confirm password (must match password)',
        NEW_PASSWORD:
            'New password (minimum 8 characters, must contain uppercase, lowercase, number, and special character)',
        RESET_TOKEN: 'Password reset token received via email',
        VERIFY_TOKEN: 'Email verification token',
        REMEMBER_ME: 'Remember me for extended session',
        REFRESH_TOKEN: 'Refresh token for obtaining new access tokens',
        OTP_CODE: '6-digit OTP code sent to email',
    },
    ADMIN: {
        DELETE_USER: 'User ID to delete',
    },

    // Coupon related descriptions
    COUPON: {
        CODE: 'Unique coupon code',
        DESCRIPTION: 'Coupon description',
        TYPE: 'Type of discount',
        VALUE: 'Discount value (percentage 0-100 or fixed amount)',
        MINIMUM_ORDER_AMOUNT: 'Minimum order amount to apply coupon',
        MAXIMUM_DISCOUNT_AMOUNT: 'Maximum discount amount (for percentage coupons)',
        USAGE_LIMIT: 'Maximum number of times this coupon can be used',
        USAGE_LIMIT_PER_USER: 'Maximum uses per user',
        USAGE_COUNT: 'Number of times this coupon has been used',
        START_DATE: 'Coupon start date',
        EXPIRY_DATE: 'Coupon expiry date',
        STATUS: 'Coupon status',
        APPLICABLE_PRODUCTS: 'Applicable product IDs (empty means all products)',
        APPLICABLE_CATEGORIES: 'Applicable category IDs (empty means all categories)',
        EXCLUDED_PRODUCTS: 'Excluded product IDs',
        EXCLUDED_CATEGORIES: 'Excluded category IDs',
        IS_STACKABLE: 'Whether coupon is stackable with other coupons',
        CREATED_BY: 'Created by admin user ID',
        CREATED_AT: 'Creation timestamp',
        UPDATED_AT: 'Last update timestamp',
    },

    // Coupon Usage related descriptions
    COUPON_USAGE: {
        COUPON_ID: 'Coupon ID',
        USER_ID: 'User ID who used the coupon',
        ORDER_ID: 'Order ID where coupon was used',
        DISCOUNT_AMOUNT: 'Discount amount applied',
        ORIGINAL_AMOUNT: 'Original order amount before discount',
        FINAL_AMOUNT: 'Final order amount after discount',
        USAGE_TIMESTAMP: 'Usage timestamp',
    },

    // Coupon Application related descriptions
    COUPON_APPLICATION: {
        CODE: 'Coupon code to apply',
        CART_ITEMS: 'Cart items to apply coupon to',
        SUCCESS: 'Whether coupon was successfully applied',
        MESSAGE: 'Error message if application failed',
        COUPON_DETAILS: 'Applied coupon details',
    },

    // Cart Item related descriptions
    CART_ITEM: {
        PRODUCT_ID: 'Product ID',
        QUANTITY: 'Quantity',
        PRICE: 'Unit price',
        CATEGORY_ID: 'Category ID',
    },

    // Query related descriptions
    QUERY: {
        PAGE: 'Page number',
        LIMIT: 'Number of items per page',
        SEARCH: 'Search term',
        ACTIVE_ONLY: 'Filter by active items only',
    },

    // Payment related descriptions
    PAYMENT: {
        ORDER_ID: 'Order ID to create payment for',
        AMOUNT_CENTS: 'Payment amount in cents',
        CURRENCY: 'Currency code',
        PAYMENT_METHOD: 'Payment method used',
        STATUS: 'Payment status',
        PAYMOB_ORDER_ID: 'Paymob order ID',
        PAYMOB_TRANSACTION_ID: 'Paymob transaction ID (from webhook)',
        PAYMENT_KEY_TOKEN: 'Paymob payment key token',
        IDEMPOTENCY_KEY: 'Idempotency key to prevent duplicate payments',
        INTEGRATION_ID: 'Paymob integration ID used for payment',
        GATEWAY_RESPONSE: 'Payment gateway response data',
        WEBHOOK_DATA: 'Webhook data received from Paymob',
        FAILURE_REASON: 'Payment failure reason',
        REFUNDED_AMOUNT_CENTS: 'Refund amount in cents',
        REFUNDS: 'Refund transactions',
        PROCESSED_AT: 'Payment processed timestamp',
        EXPIRES_AT: 'Payment expiry timestamp',
        METADATA: 'Additional metadata',
        IFRAME_URL: 'Iframe URL for payment',
        PREFERRED_PAYMENT_METHOD: 'Preferred payment method',
        AMOUNT: 'Payment amount',
        WALLET_MSISDN: 'Wallet MSISDN',
    },

    // Review related descriptions
    REVIEW: {
        PRODUCT_ID: 'Product being reviewed',
        USER_ID: 'User who wrote the review',
        ORDER_ID: 'Order associated with the review',
        RATING: 'Rating from 1 to 5 stars',
        COMMENT: 'Review comment text',
        STATUS: 'Review moderation status',
        SORT_BY: 'Field to sort reviews by',
        SORT_ORDER: 'Sort direction (ascending or descending)',
    },

    // Return related descriptions
    RETURN: {
        ORDER_ID: 'Order ID for the return',
        USER_ID: 'User requesting the return',
        PRODUCT_ID: 'Product being returned',
        QUANTITY: 'Quantity of items to return',
        REASON: 'Reason for the return',
        DESCRIPTION: 'Detailed description of the return reason',
        STATUS: 'Return processing status',
        REFUND_METHOD: 'Method for processing the refund',
        REFUND_AMOUNT: 'Amount to be refunded',
        TRACKING_NUMBER: 'Tracking number for return shipment',
        ADMIN_NOTES: 'Internal admin notes for return processing',
        PROCESSED_BY: 'Admin who processed the return',
        PROCESSED_AT: 'Date when return was processed',
        REFUNDED_AT: 'Date when refund was issued',
        EXPECTED_RETURN_DATE: 'Expected date for item to be returned',
    },

    // Common descriptions
    COMMON: {
        ID: 'Unique identifier',
        CREATED_AT: 'Creation timestamp',
        UPDATED_AT: 'Last update timestamp',
        USER_ID: 'User ID',
    },
} as const;

// API Property examples for Swagger documentation
export const API_EXAMPLES = {
    // Auth related examples
    AUTH: {
        EMAIL: 'user@example.com',
        PASSWORD: 'Password123!',
        USERNAME: 'John',
        NEW_PASSWORD: 'NewPassword123!',
        RESET_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        VERIFY_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        REMEMBER_ME: false,
        REFRESH_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        OTP_CODE: '123456',
    },

    // Coupon related examples
    COUPON: {
        CODE: 'SAVE20',
        DESCRIPTION: 'Save 20% on all items',
        VALUE_PERCENTAGE: 20,
        VALUE_FIXED: 50,
        MINIMUM_ORDER_AMOUNT: 100,
        MAXIMUM_DISCOUNT_AMOUNT: 500,
        USAGE_LIMIT: 100,
        USAGE_LIMIT_PER_USER: 1,
        USAGE_COUNT: 25,
        START_DATE: '2024-01-01T00:00:00.000Z',
        EXPIRY_DATE: '2024-12-31T23:59:59.999Z',
        APPLICABLE_PRODUCTS: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
        APPLICABLE_CATEGORIES: ['507f1f77bcf86cd799439013'],
        EXCLUDED_PRODUCTS: [],
        EXCLUDED_CATEGORIES: [],
        IS_STACKABLE: false,
    },

    // Coupon Usage related examples
    COUPON_USAGE: {
        DISCOUNT_AMOUNT: 25.5,
        ORIGINAL_AMOUNT: 150.0,
        FINAL_AMOUNT: 124.5,
    },

    // Cart Item related examples
    CART_ITEM: {
        PRODUCT_ID: '507f1f77bcf86cd799439011',
        QUANTITY: 2,
        PRICE: 29.99,
        CATEGORY_ID: '507f1f77bcf86cd799439013',
    },

    // Query related examples
    QUERY: {
        PAGE: 1,
        LIMIT: 10,
        SEARCH: 'discount',
    },

    // Payment related examples
    PAYMENT: {
        ORDER_ID: '507f1f77bcf86cd799439015',
        AMOUNT_CENTS: 15000,
        CURRENCY: 'EGP',
        INTEGRATION_ID: 123456,
        PAYMOB_ORDER_ID: 'PMB_ORD_123456789',
        PAYMOB_TRANSACTION_ID: 'TXN_987654321',
        PAYMENT_KEY_TOKEN: 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5',
        IDEMPOTENCY_KEY: 'idem_key_123456789',
        IFRAME_URL: 'https://accept.paymob.com/api/acceptance/iframes/123456?payment_token=',
        AMOUNT: 15000,
        PAYMENT_METHOD: 'CREDIT_CARD',
        WALLET_MSISDN: '0123456789',
        METADATA: {},
    },

    // Review related examples
    REVIEW: {
        PRODUCT_ID: '507f1f77bcf86cd799439011',
        USER_ID: '507f1f77bcf86cd799439012',
        ORDER_ID: '507f1f77bcf86cd799439013',
        RATING: 5,
        COMMENT: 'Excellent product! Great quality and fast delivery.',
    },

    // Return related examples
    RETURN: {
        ORDER_ID: '507f1f77bcf86cd799439014',
        USER_ID: '507f1f77bcf86cd799439015',
        PRODUCT_ID: '507f1f77bcf86cd799439016',
        QUANTITY: 2,
        REASON: 'defective',
        DESCRIPTION: 'Product arrived with manufacturing defects and does not work as expected.',
        REFUND_AMOUNT: 299.99,
        TRACKING_NUMBER: 'RET123456789',
        ADMIN_NOTES: 'Approved for full refund after inspection',
    },

    // Common examples
    COMMON: {
        ID: '507f1f77bcf86cd799439011',
        MONGODB_OBJECT_ID: '507f1f77bcf86cd799439011',
        EMAIL: 'user@example.com',
        PHONE: '+201234567890',
        NAME: 'John Doe',
    },
} as const;

// API Operation summaries and descriptions
export const API_OPERATIONS = {
    AUTH: {
        GET_ORDER_HISTORY: {
            SUMMARY: 'Get user order history',
            DESCRIPTION: 'Get user order history with pagination',
        },
        REGISTER: {
            SUMMARY: 'Register new user',
            DESCRIPTION: 'Register a new user account',
        },
        LOGIN: {
            SUMMARY: 'User login',
            DESCRIPTION: 'Login with email and password',
        },
        REFRESH: {
            SUMMARY: 'Refresh access/refresh tokens',
            DESCRIPTION: 'Refresh access and refresh tokens',
        },
        LOGOUT: {
            SUMMARY: 'Logout and revoke refresh token',
            DESCRIPTION: 'Logout user and revoke refresh token',
        },
        FORGOT_PASSWORD: {
            SUMMARY: 'Forgot password (send reset email job)',
            DESCRIPTION: 'Send password reset email',
        },
        RESET_PASSWORD: {
            SUMMARY: 'Reset password using token',
            DESCRIPTION: 'Reset password using reset token',
        },
        GOOGLE_AUTH: {
            SUMMARY: 'Initiate Google OAuth login',
            DESCRIPTION: 'Initiate Google OAuth authentication',
        },
        GOOGLE_CALLBACK: {
            SUMMARY: 'Google OAuth callback',
            DESCRIPTION: 'Handle Google OAuth callback',
        },
        VERIFY_EMAIL_OTP: {
            SUMMARY: 'Verify email with OTP',
            DESCRIPTION: 'Verify email address with OTP code sent during registration',
        },
        RESEND_VERIFICATION_OTP: {
            SUMMARY: 'Resend verification OTP',
            DESCRIPTION: 'Resend verification OTP code to user email',
        },
        RESET_PASSWORD_OTP: {
            SUMMARY: 'Reset password with OTP',
            DESCRIPTION: 'Reset password using OTP code sent to user email',
        },
        GET_PROFILE: {
            SUMMARY: 'Get user profile',
            DESCRIPTION: 'Get authenticated user profile',
        },
        UPDATE_PROFILE: {
            SUMMARY: 'Update user profile',
            DESCRIPTION: 'Update authenticated user profile',
        },
        GET_ALL_USERS: {
            SUMMARY: 'Get all users (Admin only)',
            DESCRIPTION: 'Get all users with pagination (admin only)',
        },
        DELETE_USER: {
            SUMMARY: 'Delete user (Admin only)',
            DESCRIPTION: 'Delete user account (admin only)',
        },
    },
    ADMIN: {
        GET_DASHBOARD_ANALYTICS: {
            SUMMARY: 'Get dashboard analytics',
            DESCRIPTION: 'Get dashboard analytics',
        },
        GET_DASHBOARD_ORDERS: {
            SUMMARY: 'Get dashboard orders',
            DESCRIPTION: 'Get dashboard orders',
        },
        GET_ALL_USERS: {
            SUMMARY: 'Get all users (Admin only)',
            DESCRIPTION: 'Get all users with pagination (admin only)',
        },
        DELETE_USER: {
            SUMMARY: 'Delete user (Admin only)',
            DESCRIPTION: 'Delete user account (admin only)',
        },
        GET_SALES_ANALYTICS: {
            SUMMARY: 'Get sales analytics',
            DESCRIPTION: 'Get sales analytics',
        },
        GET_TOP_PRODUCTS: {
            SUMMARY: 'Get top products',
            DESCRIPTION: 'Get top products',
        },
        GET_USER_GROWTH: {
            SUMMARY: 'Get user growth',
            DESCRIPTION: 'Get user growth',
        },
        GET_ORDER_STATUS_BREAKDOWN: {
            SUMMARY: 'Get order status breakdown',
            DESCRIPTION: 'Get order status breakdown',
        },
    },
    REVIEWS: {
        CREATE: {
            SUMMARY: 'Create a new review',
            DESCRIPTION: 'Create a new product review for a purchased item',
        },
        FIND_ALL: {
            SUMMARY: 'Get all reviews with filtering and pagination',
            DESCRIPTION:
                'Retrieve reviews with optional filtering by product, user, status, and rating',
        },
        FIND_ONE: {
            SUMMARY: 'Get a review by ID',
            DESCRIPTION: 'Retrieve a specific review by its ID',
        },
        UPDATE: {
            SUMMARY: 'Update a review',
            DESCRIPTION: 'Update an existing review (owner only)',
        },
        MODERATE: {
            SUMMARY: 'Moderate a review (Admin only)',
            DESCRIPTION: 'Approve or reject a review (admin only)',
        },
        DELETE: {
            SUMMARY: 'Delete a review',
            DESCRIPTION: 'Delete an existing review (owner only)',
        },
        GET_PRODUCT_STATS: {
            SUMMARY: 'Get review statistics for a product',
            DESCRIPTION:
                'Get aggregated review statistics including average rating and distribution',
        },
    },
    RETURNS: {
        CREATE: {
            SUMMARY: 'Create a new return request',
            DESCRIPTION: 'Create a return request for a purchased product',
        },
        FIND_ALL: {
            SUMMARY: 'Get all return requests with filtering and pagination',
            DESCRIPTION: 'Retrieve return requests with optional filtering (admin only)',
        },
        FIND_ONE: {
            SUMMARY: 'Get a return request by ID',
            DESCRIPTION: 'Retrieve a specific return request by its ID',
        },
        UPDATE: {
            SUMMARY: 'Update a return request',
            DESCRIPTION: 'Update an existing return request (owner only)',
        },
        PROCESS: {
            SUMMARY: 'Process a return request (Admin only)',
            DESCRIPTION: 'Approve, reject, or update status of a return request',
        },
        DELETE: {
            SUMMARY: 'Delete a return request',
            DESCRIPTION: 'Delete an existing return request (owner only)',
        },
        GET_STATS: {
            SUMMARY: 'Get return statistics',
            DESCRIPTION: 'Get aggregated return statistics and metrics (admin only)',
        },
        GET_USER_RETURNS: {
            SUMMARY: 'Get current user return requests',
            DESCRIPTION: 'Retrieve return requests for the authenticated user',
        },
    },
    PAYMENTS: {
        CREATE: {
            SUMMARY: 'Initiate a new payment',
            DESCRIPTION: 'Initiate a new payment for an order',
        },
        FIND_ALL: {
            SUMMARY: 'Get all payments (admin only)',
            DESCRIPTION: 'Retrieve all payments (admin only)',
        },
        FIND_ONE: {
            SUMMARY: 'Get payment by ID',
            DESCRIPTION: 'Retrieve a specific payment by its ID',
        },
        FIND_MY_PAYMENTS: {
            SUMMARY: "Get user's own payments",
            DESCRIPTION: 'Retrieve payments for the authenticated user',
        },
        FIND_BY_ORDER: {
            SUMMARY: 'Get payments for specific order',
            DESCRIPTION: 'Retrieve payments for a specific order',
        },
        UPDATE: {
            SUMMARY: 'Update payment details (admin only)',
            DESCRIPTION: 'Update payment details (admin only)',
        },
        REFUND: {
            SUMMARY: 'Process payment refund (admin only)',
            DESCRIPTION: 'Process payment refund (admin only)',
        },
        GET_STATS: {
            SUMMARY: 'Get payment statistics (admin only)',
            DESCRIPTION: 'Get aggregated payment statistics and metrics (admin only)',
        },
        WEBHOOK: {
            SUMMARY: 'Handle payment gateway webhook',
            DESCRIPTION: 'Handle payment gateway webhook',
        },
    },
} as const;

// API Response messages
export const API_RESPONSE_MESSAGES = {
    AUTH: {
        ORDERS_RETRIEVED: 'Orders retrieved successfully',
        USER_REGISTERED: 'User registered',
        LOGGED_IN: 'Logged in, tokens issued',
        TOKENS_ROTATED: 'Rotated tokens issued',
        USER_LOGGED_OUT: 'User logged out and token revoked',
        RESET_EMAIL_SENT: 'Always responds success for anti-enum',
        PASSWORD_RESET: 'Password reset successful',
        EMAIL_VERIFIED_OTP: 'Email verified with OTP successfully',
        NEW_OTP_SENT: 'New OTP sent successfully',
        PASSWORD_RESET_OTP: 'Password reset with OTP successful',
        PROFILE_RETRIEVED: 'User profile retrieved',
        PROFILE_UPDATED: 'Profile updated successfully',
        USERS_LIST: 'Users list with pagination',
        USER_DELETED: 'User deleted successfully',
        GOOGLE_AUTH_FAILED: 'Google authentication failed - no user profile received',
        NO_REFRESH_TOKEN: 'No refresh token',
        NO_ACCESS_TOKEN: 'No access token',
        INVALID_OR_EXPIRED_OTP: 'Invalid or expired OTP',
        INVALID_ACCESS_TOKEN: 'Invalid access token',
        INVALID_USER_ID: 'Invalid user ID',
        LOGGED_OUT: 'Logged out',
    },
    ADMIN: {
        USER_GROWTH_RETRIEVED: 'User growth retrieved successfully',
        ORDER_STATUS_BREAKDOWN_RETRIEVED: 'Order status breakdown retrieved successfully',
        TOP_PRODUCTS_RETRIEVED: 'Top products retrieved successfully',
        SALES_ANALYTICS_RETRIEVED: 'Sales analytics retrieved successfully',
        DASHBOARD_ANALYTICS_RETRIEVED: 'Dashboard analytics retrieved successfully',
        USERS_LIST_RETRIEVED: 'Users list retrieved successfully',
        USER_DELETED: 'User deleted successfully',
        USER_NOT_FOUND: 'User not found',
    },
    SUCCESS: {
        CREATED: 'Resource created successfully',
        RETRIEVED: 'Resource retrieved successfully',
        UPDATED: 'Resource updated successfully',
        DELETED: 'Resource deleted successfully',
    },
    ERROR: {
        BAD_REQUEST: 'Bad request - validation error',
        UNAUTHORIZED: 'Unauthorized',
        FORBIDDEN: 'Forbidden - insufficient permissions',
        NOT_FOUND: 'Resource not found',
        CONFLICT: 'Resource already exists',
        INTERNAL_SERVER_ERROR: 'Internal server error',
    },
    REVIEWS: {
        CREATED: 'Review created successfully',
        RETRIEVED: 'Reviews retrieved successfully',
        UPDATED: 'Review updated successfully',
        DELETED: 'Review deleted successfully',
        MODERATED: 'Review moderated successfully',
        STATS_RETRIEVED: 'Product review statistics retrieved successfully',
        DUPLICATE: 'You have already reviewed this product for this order',
        NOT_OWNER: 'You can only update/delete your own reviews',
        CANNOT_UPDATE_REJECTED: 'Cannot update a rejected review',
        HELPFUL_TOGGLED: 'Review helpful status toggled successfully',
    },
    RETURNS: {
        CREATED: 'Return request created successfully',
        RETRIEVED: 'Return requests retrieved successfully',
        USER_RETURNS_RETRIEVED: 'User return requests retrieved successfully',
        STATS_RETRIEVED: 'Return statistics retrieved successfully',
        UPDATED: 'Return request updated successfully',
        PROCESSED: 'Return request processed successfully',
        DELETED: 'Return request deleted successfully',
        ORDER_NOT_FOUND: 'Order not found or not owned by user',
        PRODUCT_NOT_IN_ORDER: 'Product not found in this order',
        INVALID_QUANTITY:
            'Cannot return {requestedQuantity} items. Only {availableQuantity} were ordered.',
        RETURN_WINDOW_EXPIRED:
            'Return window has expired. Returns must be requested within {days} days of order.',
        DUPLICATE_RETURN: 'A return request already exists for this product in this order',
        NOT_OWNER: 'You can only update/delete your own return requests',
        CANNOT_UPDATE_NON_PENDING: 'Cannot update return request that is no longer pending',
        CANNOT_DELETE_NON_PENDING: 'Cannot delete return request that is no longer pending',
    },
    PAYMENTS: {
        CREATED: 'Payment initiated successfully',
        RETRIEVED: 'Payment retrieved successfully',
        UPDATED: 'Payment updated successfully',
        COMPLETED: 'Payment completed successfully',
        FAILED: 'Payment failed',
        CANCELLED: 'Payment cancelled successfully',
        REFUNDED: 'Payment refunded successfully',
        INVALID_AMOUNT: 'Payment amount must be greater than 0',
        PAYMENT_NOT_FOUND: 'Payment not found',
        PAYMENT_ALREADY_PROCESSED: 'Payment has already been processed',
        INVALID_PAYMENT_METHOD: 'Invalid payment method selected',
        WEBHOOK_VERIFIED: 'Webhook verified and processed successfully',
        WEBHOOK_INVALID: 'Invalid webhook signature or data',
    },
} as const;

// API Parameter descriptions
export const API_PARAMS = {
    ID: 'Resource ID',
    PRODUCT_ID: 'Product ID',
    USER_ID: 'User ID',
    ORDER_ID: 'Order ID',
    REVIEW_ID: 'Review ID',
    RETURN_ID: 'Return request ID',
    PAYMENT_ID: 'Payment ID',
} as const;
