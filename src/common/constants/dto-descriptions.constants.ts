// ==================== ORDER DTO DESCRIPTIONS ====================

export const ORDER_DTO_DESCRIPTIONS = {
    // CreateOrderDto
    USER_ID: 'The ID of the user placing the order',
    ORDER_STATUS: 'Current status of the order',
    PAYMENT_STATUS: 'Current payment status of the order',
    SUBTOTAL: 'Subtotal amount before taxes, shipping, and discounts',
    TAX_AMOUNT: 'Tax amount applied to the order',
    SHIPPING_AMOUNT: 'Shipping cost for the order',
    DISCOUNT_AMOUNT: 'Discount amount applied to the order',
    TOTAL_AMOUNT: 'Final total amount including all charges and discounts',
    SHIPPING_ADDRESS: 'Shipping address for order delivery',
    PAYMENT_DETAILS: 'Payment method and transaction details',
    ORDER_NOTES: 'Additional notes or special instructions for the order',
    TRACKING_NUMBER: 'Shipping carrier tracking number',
    ESTIMATED_DELIVERY_DATE: 'Expected delivery date for the order',
    DELIVERED_AT: 'Actual delivery date and time',
    CANCELLED_AT: 'Date and time when the order was cancelled',
    CANCEL_REASON: 'Reason for order cancellation',

    // QueryOrderDto
    PAGE: 'Page number for pagination',
    LIMIT: 'Number of items per page (max 100)',
    SEARCH: 'Search term for order number or customer name',
    FILTER_USER_ID: 'Filter orders by user ID',
    FILTER_STATUS: 'Filter orders by order status',
    FILTER_PAYMENT_STATUS: 'Filter orders by payment status',
    START_DATE: 'Filter orders created on or after this date',
    END_DATE: 'Filter orders created on or before this date',
    SORT_BY: 'Field to sort orders by',
    SORT_ORDER: 'Sort direction (ascending or descending)',

    // CheckoutDto
    CART_ITEMS: 'Array of items to be ordered',
    CHECKOUT_NOTES: 'Special instructions or notes for the order',
} as const;

export const CART_ITEM_DTO_DESCRIPTIONS = {
    PRODUCT_ID: 'The ID of the product being ordered',
    SIZE: 'The size/variant of the product (e.g., S, M, L, XL)',
    QUANTITY: 'Quantity of the product to order',
    UNIT_PRICE: 'Unit price of the product at the time of checkout',
    TOTAL_PRICE: 'Total price for this line item (unitPrice × quantity)',
} as const;

export const ADDRESS_DTO_DESCRIPTIONS = {
    CUSTOMER_NAME: 'Name of the recipient',
    ADDRESS_LINE_1: 'Primary street address',
    ADDRESS_LINE_2: 'Apartment, suite, unit, building, floor, etc. (optional)',
    CITY: 'City or town',
    STATE: 'State, province, or region',
    POSTAL_CODE: 'Postal code or ZIP code',
    PHONE: 'Contact phone number (optional)',
} as const;

export const PAYMENT_DETAILS_DTO_DESCRIPTIONS = {
    METHOD: 'Payment method (e.g., credit_card, paypal, stripe)',
    TRANSACTION_ID: 'Unique transaction identifier from payment provider',
    PAYMENT_INTENT_ID: 'Payment intent ID (for Stripe payments)',
    LAST_4: 'Last 4 digits of the card number',
    BRAND: 'Card brand (e.g., Visa, Mastercard, Amex)',
} as const;

// ==================== DTO EXAMPLES ====================

export const ORDER_DTO_EXAMPLES = {
    USER_ID: '507f1f77bcf86cd799439011',
    SUBTOTAL: 99.99,
    TAX_AMOUNT: 8.5,
    SHIPPING_AMOUNT: 10.0,
    DISCOUNT_AMOUNT: 5.0,
    TOTAL_AMOUNT: 113.49,
    TRACKING_NUMBER: '1Z999AA10123456784',
    ORDER_NOTES: 'Please leave at the front door',
    CANCEL_REASON: 'Customer requested cancellation',
    SEARCH: 'ORD-2024-001',
    PAGE: 1,
    LIMIT: 10,
} as const;

export const CART_ITEM_DTO_EXAMPLES = {
    PRODUCT_ID: '507f1f77bcf86cd799439011',
    SIZE: 'M',
    QUANTITY: 2,
    UNIT_PRICE: 29.99,
    TOTAL_PRICE: 59.98,
} as const;

export const ADDRESS_DTO_EXAMPLES = {
    CUSTOMER_NAME: 'John Doe',
    ADDRESS_LINE_1: '123 Main Street',
    ADDRESS_LINE_2: 'Apt 4B',
    CITY: 'New York',
    STATE: 'NY',
    POSTAL_CODE: '10001',
    PHONE: '+1-555-123-4567',
} as const;

export const PAYMENT_DETAILS_DTO_EXAMPLES = {
    METHOD: 'credit_card',
    TRANSACTION_ID: 'txn_1234567890',
    PAYMENT_INTENT_ID: 'pi_1234567890',
    LAST_4: '4242',
    BRAND: 'Visa',
} as const;

// ==================== VALIDATION MESSAGES ====================

export const ORDER_VALIDATION_MESSAGES = {
    // Required field messages
    PRODUCT_ID_REQUIRED: 'Product ID is required',
    SIZE_REQUIRED: 'Size is required',
    QUANTITY_REQUIRED: 'Quantity is required',
    UNIT_PRICE_REQUIRED: 'Unit price is required',
    TOTAL_PRICE_REQUIRED: 'Total price is required',
    FIRST_NAME_REQUIRED: 'First name is required',
    LAST_NAME_REQUIRED: 'Last name is required',
    ADDRESS_LINE_1_REQUIRED: 'Street address is required',
    CITY_REQUIRED: 'City is required',
    STATE_REQUIRED: 'State is required',
    POSTAL_CODE_REQUIRED: 'Postal code is required',
    COUNTRY_REQUIRED: 'Country is required',

    // Type validation messages
    PRODUCT_ID_STRING: 'Product ID must be a string',
    SIZE_STRING: 'Size must be a string',
    QUANTITY_NUMBER: 'Quantity must be a number',
    UNIT_PRICE_NUMBER: 'Unit price must be a number',
    TOTAL_PRICE_NUMBER: 'Total price must be a number',
    FIRST_NAME_STRING: 'First name must be a string',
    LAST_NAME_STRING: 'Last name must be a string',
    COMPANY_STRING: 'Company must be a string',
    ADDRESS_LINE_1_STRING: 'Street address must be a string',
    ADDRESS_LINE_2_STRING: 'Address line 2 must be a string',
    CITY_STRING: 'City must be a string',
    STATE_STRING: 'State must be a string',
    POSTAL_CODE_STRING: 'Postal code must be a string',
    COUNTRY_STRING: 'Country must be a string',
    PHONE_STRING: 'Phone number must be a string',

    // Range validation messages
    QUANTITY_MIN: 'Quantity must be at least 1',
    UNIT_PRICE_MIN: 'Unit price cannot be negative',
    TOTAL_PRICE_MIN: 'Total price cannot be negative',
    PAGE_MIN: 'Page number must be at least 1',
    LIMIT_MIN: 'Limit must be at least 1',
    LIMIT_MAX: 'Limit cannot exceed 100',
    AMOUNT_MIN: 'Amount cannot be negative',

    // Custom validation messages
    TOTAL_PRICE_MISMATCH: 'Total price must equal unit price multiplied by quantity',
    INVALID_DATE_FORMAT: 'Invalid date format. Use ISO 8601 format',
} as const;
