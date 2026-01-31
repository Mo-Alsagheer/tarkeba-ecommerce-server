export enum ReviewStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    FLAGGED = 'flagged',
}

export enum ReviewRating {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
}

export enum ReviewType {
    PRODUCT = 'product',
    ORDER = 'order',
    SELLER = 'seller',
}

export enum ReviewSortBy {
    CREATED_AT = 'createdAt',
    RATING = 'rating',
    UPDATED_AT = 'updatedAt',
}
