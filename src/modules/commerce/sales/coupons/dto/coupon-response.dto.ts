import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CouponType, CouponStatus } from '../../../../../common/enums';
import {
    COUPONS_SWAGGER_EXAMPLES,
    COUPONS_RESPONSE_DTO_DESCRIPTIONS,
    COUPONS_RESPONSE_DTO_EXAMPLES,
    COUPONS_MESSAGES,
} from '../../../../../common/constants';

export class CouponInfoDto {
    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.COUPON_ID,
        example: COUPONS_SWAGGER_EXAMPLES.MONGODB_OBJECT_ID,
    })
    id: string;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.COUPON_CODE,
        example: COUPONS_SWAGGER_EXAMPLES.COUPON_CODE,
    })
    code: string;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.COUPON_DESCRIPTION,
        example: COUPONS_SWAGGER_EXAMPLES.COUPON_DESCRIPTION,
    })
    description: string;

    @ApiProperty({
        enum: CouponType,
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.COUPON_TYPE,
        example: CouponType.PERCENTAGE,
    })
    type: CouponType;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.DISCOUNT_VALUE_FULL,
        example: COUPONS_SWAGGER_EXAMPLES.COUPON_VALUE_PERCENTAGE,
    })
    value: number;
}

export class CouponApplicationResultDto {
    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.APPLICATION_SUCCESS,
        example: COUPONS_RESPONSE_DTO_EXAMPLES.BOOLEAN_TRUE,
    })
    success: boolean;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.DISCOUNT_AMOUNT_APPLIED,
        example: COUPONS_RESPONSE_DTO_EXAMPLES.DISCOUNT_AMOUNT,
    })
    discountAmount: number;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.ORIGINAL_AMOUNT,
        example: COUPONS_RESPONSE_DTO_EXAMPLES.ORIGINAL_AMOUNT,
    })
    originalAmount: number;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.FINAL_AMOUNT,
        example: COUPONS_RESPONSE_DTO_EXAMPLES.FINAL_AMOUNT,
    })
    finalAmount: number;

    @ApiPropertyOptional({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.RESULT_MESSAGE,
        example: COUPONS_RESPONSE_DTO_EXAMPLES.RESULT_MESSAGE,
    })
    message?: string;

    @ApiPropertyOptional({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.COUPON_INFO,
        type: CouponInfoDto,
    })
    coupon?: CouponInfoDto;
}

export class CouponResponseDto {
    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.COUPON_ID,
        example: COUPONS_SWAGGER_EXAMPLES.MONGODB_OBJECT_ID,
    })
    _id: string;

    @ApiProperty({
        description: 'Coupon code',
        example: COUPONS_SWAGGER_EXAMPLES.COUPON_CODE,
    })
    code: string;

    @ApiProperty({
        description: 'Coupon description',
        example: COUPONS_SWAGGER_EXAMPLES.COUPON_DESCRIPTION,
    })
    description: string;

    @ApiProperty({
        enum: CouponType,
        description: 'Coupon type',
        example: CouponType.PERCENTAGE,
    })
    type: CouponType;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.DISCOUNT_VALUE,
        example: COUPONS_SWAGGER_EXAMPLES.COUPON_VALUE_PERCENTAGE,
    })
    value: number;

    @ApiPropertyOptional({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.MINIMUM_ORDER_AMOUNT,
        example: COUPONS_SWAGGER_EXAMPLES.MINIMUM_ORDER_AMOUNT,
    })
    minimumOrderAmount?: number;

    @ApiPropertyOptional({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.MAXIMUM_DISCOUNT_AMOUNT,
        example: COUPONS_SWAGGER_EXAMPLES.MAXIMUM_DISCOUNT_AMOUNT,
    })
    maximumDiscountAmount?: number;

    @ApiPropertyOptional({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.USAGE_LIMIT,
        example: COUPONS_SWAGGER_EXAMPLES.USAGE_LIMIT,
    })
    usageLimit?: number;

    @ApiPropertyOptional({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.USAGE_LIMIT_PER_USER,
        example: COUPONS_SWAGGER_EXAMPLES.USAGE_LIMIT_PER_USER,
    })
    usageLimitPerUser?: number;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.USAGE_COUNT,
        example: COUPONS_RESPONSE_DTO_EXAMPLES.USAGE_COUNT,
    })
    usageCount: number;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.START_DATE,
        example: COUPONS_SWAGGER_EXAMPLES.START_DATE,
    })
    startDate: Date;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.EXPIRY_DATE,
        example: COUPONS_SWAGGER_EXAMPLES.EXPIRY_DATE,
    })
    expiryDate: Date;

    @ApiProperty({
        enum: CouponStatus,
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.STATUS,
        example: CouponStatus.ACTIVE,
    })
    status: CouponStatus;

    @ApiPropertyOptional({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.APPLICABLE_PRODUCTS,
        type: [String],
        example: COUPONS_SWAGGER_EXAMPLES.APPLICABLE_PRODUCTS,
    })
    applicableProducts?: string[];

    @ApiPropertyOptional({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.APPLICABLE_CATEGORIES,
        type: [String],
        example: COUPONS_SWAGGER_EXAMPLES.APPLICABLE_CATEGORIES,
    })
    applicableCategories?: string[];

    @ApiPropertyOptional({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.EXCLUDED_PRODUCTS,
        type: [String],
        example: COUPONS_SWAGGER_EXAMPLES.EXCLUDED_PRODUCTS,
    })
    excludedProducts?: string[];

    @ApiPropertyOptional({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.EXCLUDED_CATEGORIES,
        type: [String],
        example: COUPONS_SWAGGER_EXAMPLES.EXCLUDED_CATEGORIES,
    })
    excludedCategories?: string[];

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.IS_STACKABLE,
        example: COUPONS_SWAGGER_EXAMPLES.IS_STACKABLE,
    })
    isStackable: boolean;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.CREATED_BY,
    })
    createdBy: string | object;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.CREATED_AT,
        example: COUPONS_RESPONSE_DTO_EXAMPLES.CREATED_AT,
    })
    createdAt: Date;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.UPDATED_AT,
        example: COUPONS_RESPONSE_DTO_EXAMPLES.UPDATED_AT,
    })
    updatedAt: Date;
}

export class PaginationDto {
    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.PAGINATION_PAGE,
        example: COUPONS_RESPONSE_DTO_EXAMPLES.PAGINATION_PAGE,
    })
    page: number;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.PAGINATION_LIMIT,
        example: COUPONS_RESPONSE_DTO_EXAMPLES.PAGINATION_LIMIT,
    })
    limit: number;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.PAGINATION_TOTAL,
        example: COUPONS_RESPONSE_DTO_EXAMPLES.PAGINATION_TOTAL,
    })
    total: number;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.PAGINATION_PAGES,
        example: COUPONS_RESPONSE_DTO_EXAMPLES.PAGINATION_PAGES,
    })
    pages: number;
}

export class CouponsListResponseDto {
    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.LIST_OF_COUPONS,
        type: [CouponResponseDto],
    })
    data: CouponResponseDto[];

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.PAGINATION_INFO,
        type: PaginationDto,
    })
    pagination: PaginationDto;
}

export class CouponUsageStatsDto {
    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.STATS_TOTAL_USAGE,
        example: COUPONS_RESPONSE_DTO_EXAMPLES.STATS_TOTAL_USAGE,
    })
    totalUsage: number;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.STATS_TOTAL_DISCOUNT_GIVEN,
        example: COUPONS_RESPONSE_DTO_EXAMPLES.STATS_TOTAL_DISCOUNT_GIVEN,
    })
    totalDiscountGiven: number;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.STATS_AVERAGE_DISCOUNT,
        example: COUPONS_RESPONSE_DTO_EXAMPLES.STATS_AVERAGE_DISCOUNT,
    })
    averageDiscount: number;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.STATS_UNIQUE_USERS,
        example: COUPONS_RESPONSE_DTO_EXAMPLES.STATS_UNIQUE_USERS,
    })
    uniqueUsersCount: number;
}

export class CouponStatsResponseDto {
    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.STATS_COUPON_DETAILS,
        type: CouponResponseDto,
    })
    coupon: CouponResponseDto;

    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.STATS_USAGE_STATISTICS,
        type: CouponUsageStatsDto,
    })
    stats: CouponUsageStatsDto;
}

export class CouponDeleteResponseDto {
    @ApiProperty({
        description: COUPONS_RESPONSE_DTO_DESCRIPTIONS.DELETE_SUCCESS_MESSAGE,
        example: COUPONS_MESSAGES.DELETED_SUCCESSFULLY,
    })
    message: string;
}
