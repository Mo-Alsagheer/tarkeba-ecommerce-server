import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { API_DESCRIPTIONS, API_EXAMPLES } from '../../../../../common/constants/api-descriptions';

export class CartItemDto {
    @ApiProperty({ description: API_DESCRIPTIONS.CART_ITEM.PRODUCT_ID })
    @IsString()
    @IsNotEmpty()
    productID: string;

    @ApiProperty({ description: API_DESCRIPTIONS.CART_ITEM.QUANTITY })
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty({ description: API_DESCRIPTIONS.CART_ITEM.PRICE })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ description: API_DESCRIPTIONS.CART_ITEM.CATEGORY_ID })
    @IsString()
    @IsNotEmpty()
    categoryID: string;
}

export class ApplyCouponDto {
    @ApiProperty({
        description: API_DESCRIPTIONS.COUPON_APPLICATION.CODE,
        example: API_EXAMPLES.COUPON.CODE,
    })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.COUPON_APPLICATION.CART_ITEMS,
        type: [CartItemDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    cartItems: CartItemDto[];
}

export class CouponApplicationResult {
    @ApiProperty({ description: API_DESCRIPTIONS.COUPON_APPLICATION.SUCCESS })
    success: boolean;

    @ApiProperty({ description: API_DESCRIPTIONS.COUPON_USAGE.DISCOUNT_AMOUNT })
    discountAmount: number;

    @ApiProperty({ description: API_DESCRIPTIONS.COUPON_USAGE.ORIGINAL_AMOUNT })
    originalAmount: number;

    @ApiProperty({ description: API_DESCRIPTIONS.COUPON_USAGE.FINAL_AMOUNT })
    finalAmount: number;

    @ApiProperty({
        description: API_DESCRIPTIONS.COUPON_APPLICATION.COUPON_DETAILS,
    })
    coupon?: {
        id: string;
        code: string;
        description: string;
        type: string;
        value: number;
    };

    @ApiProperty({ description: API_DESCRIPTIONS.COUPON_APPLICATION.MESSAGE })
    message?: string;
}
