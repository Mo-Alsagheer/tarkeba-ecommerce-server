import { Types } from 'mongoose';
import { CouponType, CouponStatus } from '../enums';

export interface ICouponUsageStats {
    totalUsage: number;
    totalDiscountGiven: number;
    averageDiscount: number;
    uniqueUsersCount: number;
}

export interface ICouponUsageStatsResponse {
    coupon: unknown;
    stats: ICouponUsageStats;
}

export interface ICouponResponse {
    _id?: unknown;
    code: string;
    description: string;
    type: CouponType;
    value: number;
    minimumOrderAmount?: number;
    maximumDiscountAmount?: number;
    usageLimit?: number;
    usageLimitPerUser?: number;
    usageCount: number;
    startDate: Date;
    expiryDate: Date;
    status: CouponStatus;
    applicableProducts?: Types.ObjectId[] | string[];
    applicableCategories?: Types.ObjectId[] | string[];
    excludedProducts?: Types.ObjectId[] | string[];
    excludedCategories?: Types.ObjectId[] | string[];
    isStackable: boolean;
    createdBy?: unknown;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICouponsListResponse {
    data: ICouponResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface ICouponValidationResult {
    valid: boolean;
    message?: string;
}

export interface ICouponApplicationResult {
    success: boolean;
    discountAmount: number;
    originalAmount: number;
    finalAmount: number;
    message?: string;
    coupon?: {
        id: string;
        code: string;
        description: string;
        type: CouponType;
        value: number;
    };
}

export interface ICouponDeleteResponse {
    message: string;
}
