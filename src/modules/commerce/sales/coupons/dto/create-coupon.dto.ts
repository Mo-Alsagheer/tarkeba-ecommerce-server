import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsEnum,
    IsNumber,
    IsDate,
    IsOptional,
    IsArray,
    IsBoolean,
    Min,
    Max,
    IsNotEmpty,
    Length,
    IsMongoId,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CouponType } from '../entities/coupon.entity';
import { API_DESCRIPTIONS, API_EXAMPLES } from '../../../../../common/constants/api-descriptions';

export class CreateCouponDto {
    @ApiProperty({
        description: API_DESCRIPTIONS.COUPON.CODE,
        example: API_EXAMPLES.COUPON.CODE,
    })
    @IsString()
    @IsNotEmpty()
    @Length(3, 20)
    @Transform(({ value }: { value: string }) => value.toUpperCase().trim())
    code: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.COUPON.DESCRIPTION,
        example: API_EXAMPLES.COUPON.DESCRIPTION,
    })
    @IsString()
    @IsNotEmpty()
    @Length(10, 200)
    description: string;

    @ApiProperty({
        enum: CouponType,
        description: API_DESCRIPTIONS.COUPON.TYPE,
    })
    @IsEnum(CouponType)
    type: CouponType;

    @ApiProperty({
        description: API_DESCRIPTIONS.COUPON.VALUE,
        example: API_EXAMPLES.COUPON.VALUE_PERCENTAGE,
    })
    @IsNumber()
    @Min(0)
    @Max(100000)
    value: number;

    @ApiProperty({
        description: API_DESCRIPTIONS.COUPON.MINIMUM_ORDER_AMOUNT,
        example: API_EXAMPLES.COUPON.MINIMUM_ORDER_AMOUNT,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    minimumOrderAmount?: number;

    @ApiProperty({
        description: API_DESCRIPTIONS.COUPON.MAXIMUM_DISCOUNT_AMOUNT,
        example: API_EXAMPLES.COUPON.MAXIMUM_DISCOUNT_AMOUNT,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    maximumDiscountAmount?: number;

    @ApiProperty({
        description: API_DESCRIPTIONS.COUPON.USAGE_LIMIT,
        example: API_EXAMPLES.COUPON.USAGE_LIMIT,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    usageLimit?: number;

    @ApiProperty({
        description: API_DESCRIPTIONS.COUPON.USAGE_LIMIT_PER_USER,
        example: API_EXAMPLES.COUPON.USAGE_LIMIT_PER_USER,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    usageLimitPerUser?: number;

    @ApiProperty({
        description: API_DESCRIPTIONS.COUPON.START_DATE,
        example: API_EXAMPLES.COUPON.START_DATE,
    })
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @ApiProperty({
        description: API_DESCRIPTIONS.COUPON.EXPIRY_DATE,
        example: API_EXAMPLES.COUPON.EXPIRY_DATE,
    })
    @IsDate()
    @Type(() => Date)
    expiryDate: Date;

    @ApiProperty({
        description: API_DESCRIPTIONS.COUPON.APPLICABLE_PRODUCTS,
        example: API_EXAMPLES.COUPON.APPLICABLE_PRODUCTS,
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    applicableProducts?: string[];

    @ApiProperty({
        description: API_DESCRIPTIONS.COUPON.APPLICABLE_CATEGORIES,
        example: API_EXAMPLES.COUPON.APPLICABLE_CATEGORIES,
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    applicableCategories?: string[];

    @ApiProperty({
        description: API_DESCRIPTIONS.COUPON.EXCLUDED_PRODUCTS,
        example: API_EXAMPLES.COUPON.EXCLUDED_PRODUCTS,
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    excludedProducts?: string[];

    @ApiProperty({
        description: API_DESCRIPTIONS.COUPON.EXCLUDED_CATEGORIES,
        example: API_EXAMPLES.COUPON.EXCLUDED_CATEGORIES,
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    excludedCategories?: string[];

    @ApiProperty({
        description: API_DESCRIPTIONS.COUPON.IS_STACKABLE,
        example: API_EXAMPLES.COUPON.IS_STACKABLE,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isStackable?: boolean;
}
