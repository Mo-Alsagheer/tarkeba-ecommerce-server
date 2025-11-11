export interface CartItem {
    productId: string;
    variantSize: string; // Which size variant was selected (e.g., 'S', 'M', 'L')
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    addedAt?: Date;

    // Optional enriched data for frontend
    productName?: string;
    productSlug?: string;
    productImage?: string;
    isAvailable?: boolean;
    availableStock?: number;
}

export interface CartSummary {
    itemCount: number;
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    discountAmount: number;
    totalAmount: number;
    items: CartItem[];
    couponCode?: string;
    couponDetails?: {
        id: string;
        code: string;
        description: string;
        type: string;
        value: number;
    };
}

export interface UpdatedItems {
    productId: string;
    variantSize: string;
    oldPrice: number;
    newPrice: number;
}

export interface CartValidationResult {
    validItems: CartItem[];
    invalidItems: { productId: string; variantSize: string; reason: string }[];
    updatedItems: UpdatedItems[];
}

export interface StockValidationResult {
    valid: boolean;
    unavailableItems: {
        productID: string;
        requested: number;
        available: number;
    }[];
}

export interface CouponDetails {
    id: string;
    code: string;
    description: string;
    type: string;
    value: number;
}

export interface ApplyCouponResult {
    valid: boolean;
    discountAmount: number;
    message: string;
    couponDetails?: CouponDetails;
}

export interface ApplyCouponSummary {
    success: boolean;
    coupon?: ApplyCouponResult;
    summary?: CartSummary;
    message?: string;
}
