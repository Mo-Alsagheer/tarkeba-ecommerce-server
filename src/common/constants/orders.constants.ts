// Import OrderStatus enum
import { OrderStatus } from '../../modules/commerce/sales/orders/entities/order.entity';

export const ORDERS_MESSAGES = {
    ORDER_CREATED_SUCCESSFULLY: 'Order created successfully',
    ORDER_UPDATED_SUCCESSFULLY: 'Order updated successfully',
    ORDER_CANCELLED_SUCCESSFULLY: 'Order cancelled successfully',
    ITEM_ADDED_TO_CART: 'Item added to cart successfully',
    ITEM_UPDATED_IN_CART: 'Cart item updated successfully',
    ITEM_REMOVED_FROM_CART: 'Item removed from cart successfully',
    CART_CLEARED: 'Cart cleared successfully',
    CHECKOUT_COMPLETED: 'Checkout completed successfully',
} as const;

export const ORDERS_API_RESPONSES = {
    //Success responses
    ORDER_CREATED: 'Order created successfully',
    ORDERS_RETRIEVED: 'Orders retrieved successfully',
    ORDER_RETRIEVED: 'Order retrieved successfully',
    ORDER_UPDATED: 'Order updated successfully',
    ORDER_CANCELLED: 'Order cancelled successfully',
    CART_RETRIEVED: 'Cart retrieved successfully',
    CART_UPDATED: 'Cart updated successfully',
    ITEM_ADDED_TO_CART: 'Item added to cart successfully',
    ITEM_REMOVED_FROM_CART: 'Item removed from cart successfully',
    CHECKOUT_COMPLETED: 'Checkout completed successfully',
    ORDER_ITEMS_RETRIEVED: 'Order items retrieved successfully',

    // Error responses
    INVALID_INPUT_DATA: 'Invalid input data',
    ORDER_NOT_FOUND: 'Order not found',
    INVALID_ORDER_ID: 'Invalid order ID',
    CART_NOT_FOUND: 'Cart not found',
    PRODUCT_NOT_FOUND: 'Product not found',
    INSUFFICIENT_STOCK: 'Insufficient stock for one or more items',
    INVALID_QUANTITY: 'Invalid quantity specified',
    CART_IS_EMPTY: 'Cart is empty',
    ORDER_CANNOT_BE_MODIFIED: 'Order cannot be modified in current status',
    ORDER_ALREADY_CANCELLED: 'Order is already cancelled',
    PAYMENT_REQUIRED: 'Payment is required to complete order',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN_ACCESS: 'Forbidden - Access denied',
} as const;

export const ORDERS_OPERATIONS = {
    CREATE_ORDER: 'Create a new order',
    GET_ALL_ORDERS: 'Get all orders with filtering and pagination',
    GET_ORDER_BY_ID: 'Get order by ID',
    GET_ORDER_BY_NUMBER: 'Get order by order number',
    UPDATE_ORDER: 'Update order',
    CANCEL_ORDER: 'Cancel order',
    GET_USER_ORDERS: 'Get orders for a specific user',
    GET_ORDER_ITEMS: 'Get items for a specific order',

    // Cart operations
    GET_CART: 'Get user cart',
    ADD_TO_CART: 'Add item to cart',
    UPDATE_CART_ITEM: 'Update cart item quantity',
    REMOVE_FROM_CART: 'Remove item from cart',
    CLEAR_CART: 'Clear all items from cart',
    CHECKOUT: 'Checkout cart and create order',
    VALIDATE_CART: 'Validate cart items and stock',
} as const;

export const ORDER_STATUS_FLOW = {
    [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
    [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: [],
    [OrderStatus.REFUNDED]: [],
} as const;

export const ORDERS_CONTROLLER_LOG_MESSAGES = {
    CREATING_ORDER: 'Creating order',
    FETCHING_ORDERS: 'Fetching orders',
    FETCHING_ORDER_BY_ID: 'Fetching order by ID',
    UPDATING_ORDER: 'Updating order',
    PROCESSING_CHECKOUT: 'Processing checkout',
} as const;

export const ORDERS_LOG_MESSAGES = {
    ORDER_CREATED: (orderNumber: string) => `Order created: ${orderNumber}`,
    ORDER_UPDATED: (orderNumber: string) => `Order updated: ${orderNumber}`,
    ORDER_CANCELLED: (orderNumber: string) => `Order cancelled: ${orderNumber}`,
    CHECKOUT_COMPLETED: (userId: string, orderNumber: string) =>
        `Checkout completed for user ${userId}, order: ${orderNumber}`,
    FAILED_TO_CREATE_ORDER: 'Failed to create order',
    FAILED_TO_FETCH_ORDERS: 'Failed to fetch orders',
    FAILED_TO_FETCH_ORDER: (id: string) => `Failed to fetch order: ${id}`,
    FAILED_TO_FETCH_ORDER_BY_NUMBER: (orderNumber: string) =>
        `Failed to fetch order by number: ${orderNumber}`,
    FAILED_TO_UPDATE_ORDER: (id: string) => `Failed to update order: ${id}`,
    FAILED_TO_CANCEL_ORDER: (id: string) => `Failed to cancel order: ${id}`,
    FAILED_TO_FETCH_ORDER_ITEMS: (orderId: string) => `Failed to fetch order items for ${orderId}`,
    FAILED_CHECKOUT: (userId: string) => `Checkout failed for user ${userId}`,
} as const;

export const ORDERS_ERROR_MESSAGES = {
    INVALID_USER_ID: 'Invalid user ID',
    INVALID_ORDER_ID: 'Invalid order ID',
    ORDER_NOT_FOUND: 'Order not found',
    CART_IS_EMPTY: 'Cart is empty',
    PRODUCT_NOT_FOUND: (productId: string) => `Product with ID ${productId} not found`,
    PRODUCT_NOT_AVAILABLE: (productName: string) => `Product ${productName} is not available`,
    VARIANT_NOT_FOUND: (productName: string) => `Variant not found for product ${productName}`,
    PRICE_CHANGED: (productName: string, size: string, oldPrice: number, newPrice: number) =>
        `Price for ${productName} (${size}) has changed from ${oldPrice} to ${newPrice}. Please refresh your cart.`,
    INSUFFICIENT_STOCK: (items: unknown) => `Insufficient stock: ${JSON.stringify(items)}`,
    ORDER_ALREADY_CANCELLED: 'Order is already cancelled',
    CANNOT_CANCEL_DELIVERED_ORDER: 'Cannot cancel delivered order',
} as const;
