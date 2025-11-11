import { IsString, IsNumber, Min, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    CART_DTO_DESCRIPTIONS,
    CART_DTO_VALIDATION,
} from '../../../../../common/constants/cart.constants';

export class AddToCartDto {
    @ApiProperty({
        description: CART_DTO_DESCRIPTIONS.PRODUCT_ID.DESCRIPTION,
        example: CART_DTO_DESCRIPTIONS.PRODUCT_ID.EXAMPLE,
    })
    @IsString()
    productId: string;

    @ApiProperty({
        description: CART_DTO_DESCRIPTIONS.QUANTITY.DESCRIPTION,
        example: CART_DTO_DESCRIPTIONS.QUANTITY.EXAMPLE,
        minimum: CART_DTO_VALIDATION.MIN_QUANTITY,
    })
    @IsNumber()
    @Min(CART_DTO_VALIDATION.MIN_QUANTITY)
    quantity: number;
}

export class UpdateCartItemDto {
    @ApiProperty({
        description: CART_DTO_DESCRIPTIONS.NEW_QUANTITY.DESCRIPTION,
        example: CART_DTO_DESCRIPTIONS.NEW_QUANTITY.EXAMPLE,
        minimum: CART_DTO_VALIDATION.MIN_QUANTITY,
    })
    @IsNumber()
    @Min(CART_DTO_VALIDATION.MIN_QUANTITY)
    quantity: number;
}

export class CartItemDto {
    @ApiProperty({
        description: CART_DTO_DESCRIPTIONS.PRODUCT_ID.DESCRIPTION,
        example: CART_DTO_DESCRIPTIONS.PRODUCT_ID.EXAMPLE,
    })
    @IsString()
    productId: string;

    @ApiProperty({
        description: CART_DTO_DESCRIPTIONS.VARIANT_SIZE.DESCRIPTION,
        example: CART_DTO_DESCRIPTIONS.VARIANT_SIZE.EXAMPLE,
    })
    @IsString()
    variantSize: string;

    @ApiProperty({
        description: CART_DTO_DESCRIPTIONS.QUANTITY.DESCRIPTION,
        example: CART_DTO_DESCRIPTIONS.QUANTITY.EXAMPLE,
        minimum: CART_DTO_VALIDATION.MIN_QUANTITY,
    })
    @IsNumber()
    @Min(CART_DTO_VALIDATION.MIN_QUANTITY)
    quantity: number;

    @ApiProperty({
        description: CART_DTO_DESCRIPTIONS.UNIT_PRICE.DESCRIPTION,
        example: CART_DTO_DESCRIPTIONS.UNIT_PRICE.EXAMPLE,
        minimum: CART_DTO_VALIDATION.MIN_PRICE,
    })
    @IsNumber()
    @Min(CART_DTO_VALIDATION.MIN_PRICE)
    unitPrice: number;

    @ApiProperty({
        description: CART_DTO_DESCRIPTIONS.TOTAL_PRICE.DESCRIPTION,
        example: CART_DTO_DESCRIPTIONS.TOTAL_PRICE.EXAMPLE,
        minimum: CART_DTO_VALIDATION.MIN_PRICE,
    })
    @IsNumber()
    @Min(CART_DTO_VALIDATION.MIN_PRICE)
    totalPrice: number;
}

export class ValidateCartDto {
    @ApiProperty({
        description: CART_DTO_DESCRIPTIONS.CART_ITEMS.DESCRIPTION,
        type: [CartItemDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    items: CartItemDto[];
}

export class ApplyCouponDto {
    @ApiProperty({
        description: CART_DTO_DESCRIPTIONS.CART_ITEMS_COUPON.DESCRIPTION,
        type: [CartItemDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    items: CartItemDto[];

    @ApiProperty({
        description: CART_DTO_DESCRIPTIONS.COUPON_CODE.DESCRIPTION,
        example: CART_DTO_DESCRIPTIONS.COUPON_CODE.EXAMPLE,
    })
    @IsString()
    couponCode: string;
}

export class CheckoutValidationDto {
    @ApiProperty({
        description: CART_DTO_DESCRIPTIONS.CART_ITEMS_CHECKOUT.DESCRIPTION,
        type: [CartItemDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    items: CartItemDto[];

    @ApiPropertyOptional({
        description: CART_DTO_DESCRIPTIONS.COUPON_CODE_OPTIONAL.DESCRIPTION,
        example: CART_DTO_DESCRIPTIONS.COUPON_CODE_OPTIONAL.EXAMPLE,
    })
    @IsOptional()
    @IsString()
    couponCode?: string;
}
