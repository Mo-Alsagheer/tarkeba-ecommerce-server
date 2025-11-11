/**
 * Cart validation error messages
 */
export const CART_VALIDATION_MESSAGES = {
    PRODUCT_NOT_FOUND: 'Product not found',
    PRODUCT_NOT_AVAILABLE: 'Product is no longer available',
    VARIANT_NOT_FOUND: (variantSize: string) => `Variant size '${variantSize}' not found`,
    INSUFFICIENT_STOCK: (available: number, requested: number) =>
        `Insufficient stock. Available: ${available}, Total requested: ${requested}`,
} as const;

/**
 * Coupon validation messages
 */
export const COUPON_MESSAGES = {
    INVALID_CODE: 'Invalid coupon code',
    INVALID_COUPON: 'Invalid coupon',
    APPLIED_SUCCESS: 'Coupon applied successfully',
    APPLY_FAILED: 'Failed to apply coupon',
} as const;

/**
 * Cart configuration constants
 */
export const CART_CONFIG = {
    TAX_RATE: 0.14, // 14% VAT in Egypt
    DEFAULT_SHIPPING: 0,
    DEFAULT_DISCOUNT: 0,
} as const;

/**
 * Controller log messages
 */
export const CART_LOG_MESSAGES = {
    VALIDATING_CART: 'Validating cart items',
    ENRICHING_CART: 'Enriching cart items with product details',
    APPLYING_COUPON: (code: string) => `Applying coupon: ${code}`,
    VALIDATING_CHECKOUT: 'Validating cart for checkout',
} as const;

/**
 * API response messages
 */
export const CART_STATUS = {
    HAS_ISSUES: 'has_issues',
    VALID: 'valid',
} as const;

/**
 * DTO field descriptions and examples
 */
export const CART_DTO_DESCRIPTIONS = {
    PRODUCT_ID: {
        DESCRIPTION: 'Product ID to add to cart',
        EXAMPLE: '64f1a2b3c4d5e6f7g8h9i0j1',
    },
    VARIANT_SIZE: {
        DESCRIPTION: 'Variant size (e.g., S, M, L, XL)',
        EXAMPLE: 'M',
    },
    QUANTITY: {
        DESCRIPTION: 'Quantity of the product',
        EXAMPLE: 2,
    },
    NEW_QUANTITY: {
        DESCRIPTION: 'New quantity for the cart item',
        EXAMPLE: 3,
    },
    UNIT_PRICE: {
        DESCRIPTION: 'Unit price of the product variant',
        EXAMPLE: 299.99,
    },
    TOTAL_PRICE: {
        DESCRIPTION: 'Total price for this item (unitPrice * quantity)',
        EXAMPLE: 599.98,
    },
    CART_ITEMS: {
        DESCRIPTION: 'Array of cart items to validate',
    },
    CART_ITEMS_COUPON: {
        DESCRIPTION: 'Array of cart items',
    },
    CART_ITEMS_CHECKOUT: {
        DESCRIPTION: 'Array of cart items for checkout validation',
    },
    COUPON_CODE: {
        DESCRIPTION: 'Coupon code to apply',
        EXAMPLE: 'SAVE20',
    },
    COUPON_CODE_OPTIONAL: {
        DESCRIPTION: 'Optional coupon code',
        EXAMPLE: 'SAVE20',
    },
} as const;

/**
 * DTO validation constants
 */
export const CART_DTO_VALIDATION = {
    MIN_QUANTITY: 1,
    MIN_PRICE: 0,
} as const;

/**
 * Swagger API descriptions
 */
export const CART_API_DESCRIPTIONS = {
    VALIDATE_CART: {
        SUMMARY: 'Validate cart items',
        DESCRIPTION:
            'Validates cart items against current product data, checks prices, availability, and stock levels',
        SUCCESS: 'Cart validation completed successfully',
    },
    ENRICH_CART: {
        SUMMARY: 'Enrich cart items with product details',
        DESCRIPTION:
            'Fetches and attaches product information (name, image, stock) to cart items for frontend display',
        SUCCESS: 'Cart items enriched successfully',
    },
    APPLY_COUPON: {
        SUMMARY: 'Apply coupon to cart',
        DESCRIPTION:
            'Validates and applies a coupon code to the cart, calculates discount and returns updated summary',
        SUCCESS: 'Coupon applied successfully',
    },
    VALIDATE_CHECKOUT: {
        SUMMARY: 'Validate cart for checkout',
        DESCRIPTION:
            'Complete checkout validation: validates items, checks stock, applies coupon, and prepares order data',
        SUCCESS: 'Checkout validation completed successfully',
    },
} as const;
