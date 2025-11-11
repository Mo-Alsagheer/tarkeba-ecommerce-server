export enum ReturnStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    IN_TRANSIT = 'in_transit',
    RECEIVED = 'received',
    PROCESSED = 'processed',
    REFUNDED = 'refunded',
}

export enum ReturnReason {
    DEFECTIVE = 'defective',
    WRONG_ITEM = 'wrong_item',
    NOT_AS_DESCRIBED = 'not_as_described',
    DAMAGED_IN_SHIPPING = 'damaged_in_shipping',
    CHANGED_MIND = 'changed_mind',
    SIZE_ISSUE = 'size_issue',
    OTHER = 'other',
}

export enum RefundMethod {
    ORIGINAL_PAYMENT = 'original_payment',
    STORE_CREDIT = 'store_credit',
    BANK_TRANSFER = 'bank_transfer',
}

export enum ReturnType {
    RETURN = 'return',
    EXCHANGE = 'exchange',
    REPAIR = 'repair',
}

export enum ReturnMethod {
    PICKUP = 'pickup',
    DROP_OFF = 'drop_off',
    MAIL = 'mail',
}
