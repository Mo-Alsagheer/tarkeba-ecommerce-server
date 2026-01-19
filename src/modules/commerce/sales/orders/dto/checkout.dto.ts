import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
    ArrayMinSize,
    MaxLength,
    MinLength,
    IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    CART_ITEM_DTO_DESCRIPTIONS,
    CART_ITEM_DTO_EXAMPLES,
    ORDER_DTO_DESCRIPTIONS,
    ORDER_DTO_EXAMPLES,
    ORDER_VALIDATION_MESSAGES,
} from '../../../../../common/constants';
import { AddressDto } from './address.dto';
import { PaymentMethod } from '../../../sales/payments/entities/payment.entity';

class CartItemDto {
    @ApiProperty({
        description: CART_ITEM_DTO_DESCRIPTIONS.PRODUCT_ID,
        example: CART_ITEM_DTO_EXAMPLES.PRODUCT_ID,
    })
    @IsNotEmpty({ message: ORDER_VALIDATION_MESSAGES.PRODUCT_ID_REQUIRED })
    @IsString({ message: ORDER_VALIDATION_MESSAGES.PRODUCT_ID_STRING })
    @MinLength(24, { message: ORDER_VALIDATION_MESSAGES.PRODUCT_ID_STRING })
    @MaxLength(24, { message: ORDER_VALIDATION_MESSAGES.PRODUCT_ID_STRING })
    productID: string;

    @ApiProperty({
        description: CART_ITEM_DTO_DESCRIPTIONS.SIZE,
        example: CART_ITEM_DTO_EXAMPLES.SIZE,
        required: true,
    })
    @IsNotEmpty({ message: ORDER_VALIDATION_MESSAGES.SIZE_REQUIRED })
    @IsString({ message: ORDER_VALIDATION_MESSAGES.SIZE_STRING })
    @MinLength(1)
    @MaxLength(10)
    size: string;

    @ApiProperty({
        description: CART_ITEM_DTO_DESCRIPTIONS.QUANTITY,
        minimum: 1,
        maximum: 999,
        example: CART_ITEM_DTO_EXAMPLES.QUANTITY,
    })
    @IsNotEmpty({ message: ORDER_VALIDATION_MESSAGES.QUANTITY_REQUIRED })
    @IsNumber({}, { message: ORDER_VALIDATION_MESSAGES.QUANTITY_NUMBER })
    @Min(1, { message: ORDER_VALIDATION_MESSAGES.QUANTITY_MIN })
    quantity: number;

    @ApiProperty({
        description: CART_ITEM_DTO_DESCRIPTIONS.UNIT_PRICE,
        minimum: 0,
        example: CART_ITEM_DTO_EXAMPLES.UNIT_PRICE,
    })
    @IsNotEmpty({ message: ORDER_VALIDATION_MESSAGES.UNIT_PRICE_REQUIRED })
    @IsNumber({}, { message: ORDER_VALIDATION_MESSAGES.UNIT_PRICE_NUMBER })
    @Min(0, { message: ORDER_VALIDATION_MESSAGES.UNIT_PRICE_MIN })
    unitPrice: number;

    @ApiProperty({
        description: CART_ITEM_DTO_DESCRIPTIONS.TOTAL_PRICE,
        minimum: 0,
        example: CART_ITEM_DTO_EXAMPLES.TOTAL_PRICE,
    })
    @IsNotEmpty({ message: ORDER_VALIDATION_MESSAGES.TOTAL_PRICE_REQUIRED })
    @IsNumber({}, { message: ORDER_VALIDATION_MESSAGES.TOTAL_PRICE_NUMBER })
    @Min(0, { message: ORDER_VALIDATION_MESSAGES.TOTAL_PRICE_MIN })
    totalPrice: number;
}

export class CheckoutDto {
    @ApiProperty({
        description: ORDER_DTO_DESCRIPTIONS.CART_ITEMS,
        type: [CartItemDto],
        minItems: 1,
    })
    @IsArray()
    @ArrayMinSize(1, { message: 'Cart must contain at least one item' })
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    cartItems: CartItemDto[];

    @ApiProperty({
        description: ORDER_DTO_DESCRIPTIONS.SHIPPING_ADDRESS,
        type: AddressDto,
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => AddressDto)
    shippingAddress: AddressDto;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.TAX_AMOUNT,
        example: ORDER_DTO_EXAMPLES.TAX_AMOUNT,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber()
    @Min(0, { message: ORDER_VALIDATION_MESSAGES.AMOUNT_MIN })
    taxAmount?: number;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.SHIPPING_AMOUNT,
        example: ORDER_DTO_EXAMPLES.SHIPPING_AMOUNT,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber()
    @Min(0, { message: ORDER_VALIDATION_MESSAGES.AMOUNT_MIN })
    shippingAmount?: number;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.DISCOUNT_AMOUNT,
        example: ORDER_DTO_EXAMPLES.DISCOUNT_AMOUNT,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber()
    @Min(0, { message: ORDER_VALIDATION_MESSAGES.AMOUNT_MIN })
    discountAmount?: number;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.CHECKOUT_NOTES,
        example: ORDER_DTO_EXAMPLES.ORDER_NOTES,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    notes?: string;

    @ApiProperty({
        description: 'Payment method',
        enum: PaymentMethod,
        example: PaymentMethod.CASH_ON_DELIVERY,
    })
    @IsNotEmpty({ message: 'Payment method is required' })
    @IsEnum(PaymentMethod, { message: 'Invalid payment method' })
    paymentMethod: PaymentMethod;

    @ApiPropertyOptional({
        description: 'Wallet phone number (required for wallet payments)',
        example: '01234567890',
    })
    @IsOptional()
    @IsString()
    walletMsisdn?: string;
}
