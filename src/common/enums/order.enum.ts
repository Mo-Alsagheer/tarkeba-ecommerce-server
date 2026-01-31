export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
}

// export enum PaymentStatus {
//     PENDING = 'pending',
//     PAID = 'paid',
//     FAILED = 'failed',
//     REFUNDED = 'refunded',
//     PARTIALLY_REFUNDED = 'partially_refunded',
// }

export enum ShippingMethod {
    STANDARD = 'standard',
    EXPRESS = 'express',
    OVERNIGHT = 'overnight',
    PICKUP = 'pickup',
}

export enum OrderItemStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
    RETURNED = 'returned',
}

export enum OrderSortBy {
    ORDER_NUMBER = 'orderNumber',
    TOTAL_AMOUNT = 'totalAmount',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}
