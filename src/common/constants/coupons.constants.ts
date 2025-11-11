export const COUPONS_MESSAGES = {
    CREATED_SUCCESSFULLY: 'Coupon created successfully',
    UPDATED_SUCCESSFULLY: 'Coupon updated successfully',
    DELETED_SUCCESSFULLY: 'Coupon deleted successfully',
} as const;

export const COUPONS_ERROR_MESSAGES = {
    COUPON_NOT_FOUND: 'Coupon not found',
    COUPON_CODE_ALREADY_EXISTS: 'Coupon code already exists',
    INVALID_COUPON_CODE: 'Invalid coupon code',
    COUPON_NOT_ACTIVE: 'Coupon is not active',
    COUPON_NOT_YET_VALID: 'Coupon is not yet valid',
    COUPON_EXPIRED: 'Coupon has expired',
    USAGE_LIMIT_EXCEEDED: 'Coupon usage limit exceeded',
    USER_USAGE_LIMIT_EXCEEDED: 'You have reached the usage limit for this coupon',
    MINIMUM_ORDER_NOT_MET: 'Minimum order amount required',
    NOT_APPLICABLE_TO_CART: 'Coupon is not applicable to items in your cart',
    EXCLUDED_ITEMS_IN_CART: 'Coupon cannot be applied to some items in your cart',
    START_DATE_BEFORE_EXPIRY: 'Start date must be before expiry date',
    PERCENTAGE_EXCEEDS_100: 'Percentage discount cannot exceed 100%',
    INVALID_COUPON_DATA: 'Invalid coupon data',
} as const;

export const COUPONS_LOG_MESSAGES = {
    COUPON_CREATED: 'Coupon created',
    COUPON_UPDATED: 'Coupon updated',
    COUPON_DELETED: 'Coupon deleted',
    COUPON_APPLIED: 'Coupon applied',
    COUPON_USAGE_RECORDED: 'Coupon usage recorded',
    FAILED_TO_CREATE: 'Failed to create coupon',
    FAILED_TO_FETCH: 'Failed to fetch coupon',
    FAILED_TO_FETCH_COUPONS: 'Failed to fetch coupons',
    FAILED_TO_UPDATE: 'Failed to update coupon',
    FAILED_TO_DELETE: 'Failed to delete coupon',
    FAILED_TO_APPLY: 'Failed to apply coupon',
    FAILED_TO_FETCH_STATS: 'Failed to fetch coupon statistics',
} as const;

export const COUPONS_API_RESPONSES = {
    // Success responses
    COUPON_CREATED: 'Coupon created successfully',
    COUPONS_RETRIEVED: 'Coupons retrieved successfully',
    COUPON_RETRIEVED: 'Coupon retrieved successfully',
    COUPON_UPDATED: 'Coupon updated successfully',
    COUPON_DELETED: 'Coupon deleted successfully',
    COUPON_APPLIED: 'Coupon application result',
    STATS_RETRIEVED: 'Coupon statistics retrieved successfully',
    ACTIVE_COUPONS_RETRIEVED: 'Active coupons retrieved successfully',

    // Error responses
    INVALID_COUPON_DATA: 'Invalid coupon data',
    COUPON_NOT_FOUND: 'Coupon not found',
    COUPON_CODE_EXISTS: 'Coupon code already exists',
    INVALID_UPDATE_DATA: 'Invalid update data',
    INVALID_COUPON_OR_CART: 'Invalid coupon or cart data',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN_ADMIN_REQUIRED: 'Forbidden - Admin access required',
} as const;

export const COUPONS_OPERATIONS = {
    CREATE_COUPON: 'Create a new coupon (Admin only)',
    GET_ALL_COUPONS: 'Get all coupons with pagination and filters (Admin only)',
    GET_ACTIVE_COUPONS: 'Get active coupons for public use',
    GET_COUPON_BY_ID: 'Get coupon by ID (Admin only)',
    GET_COUPON_BY_CODE: 'Get coupon by code',
    GET_COUPON_STATS: 'Get coupon usage statistics (Admin only)',
    UPDATE_COUPON: 'Update coupon (Admin only)',
    DELETE_COUPON: 'Delete coupon (Admin only)',
    APPLY_COUPON: 'Apply a coupon to cart items',
} as const;

export const COUPONS_CONTROLLER_LOG_MESSAGES = {
    CREATING_COUPON: 'Creating coupon',
    FETCHING_COUPONS: 'Fetching coupons',
    FETCHING_ACTIVE_COUPONS: 'Fetching active coupons',
    FETCHING_COUPON_BY_ID: 'Fetching coupon by ID',
    FETCHING_COUPON_BY_CODE: 'Fetching coupon by code',
    FETCHING_COUPON_STATS: 'Fetching coupon statistics',
    UPDATING_COUPON: 'Updating coupon',
    DELETING_COUPON: 'Deleting coupon',
    APPLYING_COUPON: 'Applying coupon',
} as const;

export const COUPONS_SWAGGER_PARAMS = {
    COUPON_ID: {
        name: 'id',
        description: 'Coupon ID (MongoDB ObjectId)',
        example: '507f1f77bcf86cd799439011',
    },
    COUPON_CODE: {
        name: 'code',
        description: 'Coupon code',
        example: 'SUMMER2024',
    },
} as const;

export const COUPONS_SWAGGER_EXAMPLES = {
    COUPON_CODE: 'SUMMER2024',
    COUPON_DESCRIPTION: 'Summer sale - Get 20% off on all products',
    COUPON_VALUE_PERCENTAGE: 20,
    COUPON_VALUE_FIXED: 50,
    MINIMUM_ORDER_AMOUNT: 100,
    MAXIMUM_DISCOUNT_AMOUNT: 200,
    USAGE_LIMIT: 1000,
    USAGE_LIMIT_PER_USER: 1,
    START_DATE: '2024-06-01T00:00:00.000Z',
    EXPIRY_DATE: '2024-08-31T23:59:59.999Z',
    APPLICABLE_PRODUCTS: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    APPLICABLE_CATEGORIES: ['507f1f77bcf86cd799439013'],
    EXCLUDED_PRODUCTS: ['507f1f77bcf86cd799439014'],
    EXCLUDED_CATEGORIES: ['507f1f77bcf86cd799439015'],
    IS_STACKABLE: false,
    MONGODB_OBJECT_ID: '507f1f77bcf86cd799439011',
    CART_ITEM_PRODUCT_ID: '507f1f77bcf86cd799439011',
    CART_ITEM_CATEGORY_ID: '507f1f77bcf86cd799439013',
    CART_ITEM_PRICE: 99.99,
    CART_ITEM_QUANTITY: 2,
} as const;

// ==================== COUPON RESPONSE DTO DESCRIPTIONS ====================
export const COUPONS_RESPONSE_DTO_DESCRIPTIONS = {
    // General coupon fields
    COUPON_ID: 'Coupon ID',
    COUPON_CODE: 'Coupon code',
    COUPON_DESCRIPTION: 'Coupon description',
    COUPON_TYPE: 'Coupon type',
    DISCOUNT_VALUE: 'Discount value',
    DISCOUNT_VALUE_FULL: 'Discount value (percentage or fixed amount)',
    MINIMUM_ORDER_AMOUNT: 'Minimum order amount required',
    MAXIMUM_DISCOUNT_AMOUNT: 'Maximum discount amount cap',
    USAGE_LIMIT: 'Total usage limit',
    USAGE_LIMIT_PER_USER: 'Usage limit per user',
    USAGE_COUNT: 'Current usage count',
    START_DATE: 'Coupon start date',
    EXPIRY_DATE: 'Coupon expiry date',
    STATUS: 'Coupon status',
    APPLICABLE_PRODUCTS: 'Applicable product IDs',
    APPLICABLE_CATEGORIES: 'Applicable category IDs',
    EXCLUDED_PRODUCTS: 'Excluded product IDs',
    EXCLUDED_CATEGORIES: 'Excluded category IDs',
    IS_STACKABLE: 'Whether coupon can be stacked with others',
    CREATED_BY: 'Created by user ID or user object',
    CREATED_AT: 'Creation timestamp',
    UPDATED_AT: 'Last update timestamp',

    // Collections & pagination
    LIST_OF_COUPONS: 'List of coupons',
    PAGINATION_INFO: 'Pagination information',
    PAGINATION_PAGE: 'Current page number',
    PAGINATION_LIMIT: 'Items per page',
    PAGINATION_TOTAL: 'Total number of items',
    PAGINATION_PAGES: 'Total number of pages',

    // Application result
    APPLICATION_SUCCESS: 'Whether the coupon was successfully applied',
    DISCOUNT_AMOUNT_APPLIED: 'Discount amount applied',
    ORIGINAL_AMOUNT: 'Original cart amount before discount',
    FINAL_AMOUNT: 'Final amount after discount',
    RESULT_MESSAGE: 'Message explaining the result',
    COUPON_INFO: 'Coupon information',

    // Statistics
    STATS_TOTAL_USAGE: 'Total number of times coupon was used',
    STATS_TOTAL_DISCOUNT_GIVEN: 'Total discount amount given',
    STATS_AVERAGE_DISCOUNT: 'Average discount per use',
    STATS_UNIQUE_USERS: 'Number of unique users who used the coupon',
    STATS_COUPON_DETAILS: 'Coupon details',
    STATS_USAGE_STATISTICS: 'Usage statistics',

    // Delete
    DELETE_SUCCESS_MESSAGE: 'Success message',
} as const;

// ==================== COUPON RESPONSE DTO EXAMPLES ====================
export const COUPONS_RESPONSE_DTO_EXAMPLES = {
    BOOLEAN_TRUE: true,
    DISCOUNT_AMOUNT: 19.99,
    ORIGINAL_AMOUNT: 99.99,
    FINAL_AMOUNT: 80.0,
    USAGE_COUNT: 45,
    CREATED_AT: '2024-01-15T10:30:00.000Z',
    UPDATED_AT: '2024-01-20T14:45:00.000Z',
    STATS_TOTAL_USAGE: 150,
    STATS_TOTAL_DISCOUNT_GIVEN: 2500.5,
    STATS_AVERAGE_DISCOUNT: 16.67,
    STATS_UNIQUE_USERS: 85,
    PAGINATION_PAGE: 1,
    PAGINATION_LIMIT: 10,
    PAGINATION_TOTAL: 100,
    PAGINATION_PAGES: 10,
    RESULT_MESSAGE: 'Coupon applied successfully',
} as const;
