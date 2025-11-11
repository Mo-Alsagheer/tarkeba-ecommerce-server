export enum CouponType {
    PERCENTAGE = 'percentage',
    FIXED_AMOUNT = 'fixed_amount',
    FREE_SHIPPING = 'free_shipping',
    BUY_X_GET_Y = 'buy_x_get_y',
}

export enum CouponStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    EXPIRED = 'expired',
    USED_UP = 'used_up',
}

export enum CouponScope {
    GLOBAL = 'global',
    CATEGORY = 'category',
    PRODUCT = 'product',
    USER = 'user',
}

export enum DiscountTarget {
    SUBTOTAL = 'subtotal',
    SHIPPING = 'shipping',
    TOTAL = 'total',
}
