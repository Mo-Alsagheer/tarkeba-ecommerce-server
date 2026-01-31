import {
    IsString,
    IsOptional,
    IsNumber,
    IsEnum,
    ValidateNested,
    Min,
    IsDateString,
    MinLength,
    MaxLength,
    Matches,
    IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from '../entities/order.entity';
import {
    ORDER_DTO_DESCRIPTIONS,
    ORDER_DTO_EXAMPLES,
    PAYMENT_DETAILS_DTO_DESCRIPTIONS,
    PAYMENT_DETAILS_DTO_EXAMPLES,
    ORDER_VALIDATION_MESSAGES,
} from '../../../../../common/constants';
import { AddressDto } from './address.dto';

class PaymentDetailsDto {
    @ApiProperty({
        description: PAYMENT_DETAILS_DTO_DESCRIPTIONS.METHOD,
        example: PAYMENT_DETAILS_DTO_EXAMPLES.METHOD,
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    method: string;

    @ApiPropertyOptional({
        description: PAYMENT_DETAILS_DTO_DESCRIPTIONS.TRANSACTION_ID,
        example: PAYMENT_DETAILS_DTO_EXAMPLES.TRANSACTION_ID,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    transactionID?: string;

    @ApiPropertyOptional({
        description: PAYMENT_DETAILS_DTO_DESCRIPTIONS.PAYMENT_INTENT_ID,
        example: PAYMENT_DETAILS_DTO_EXAMPLES.PAYMENT_INTENT_ID,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    paymentIntentID?: string;

    @ApiPropertyOptional({
        description: PAYMENT_DETAILS_DTO_DESCRIPTIONS.LAST_4,
        example: PAYMENT_DETAILS_DTO_EXAMPLES.LAST_4,
    })
    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(4)
    @Matches(/^[0-9]{4}$/, { message: 'Last 4 digits must be numeric' })
    last4?: string;

    @ApiPropertyOptional({
        description: PAYMENT_DETAILS_DTO_DESCRIPTIONS.BRAND,
        example: PAYMENT_DETAILS_DTO_EXAMPLES.BRAND,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    brand?: string;
}

export class CreateOrderDto {
    @ApiProperty({
        description: ORDER_DTO_DESCRIPTIONS.USER_ID,
        example: ORDER_DTO_EXAMPLES.USER_ID,
    })
    @IsString()
    @MinLength(24)
    @MaxLength(24)
    userID: string;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.ORDER_STATUS,
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus = OrderStatus.PENDING;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.PAYMENT_STATUS,
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    @IsOptional()
    @IsEnum(PaymentStatus)
    paymentStatus?: PaymentStatus = PaymentStatus.PENDING;

    @ApiProperty({
        description: ORDER_DTO_DESCRIPTIONS.SUBTOTAL,
        example: ORDER_DTO_EXAMPLES.SUBTOTAL,
        minimum: 0,
    })
    @IsNumber()
    @Min(0, { message: ORDER_VALIDATION_MESSAGES.AMOUNT_MIN })
    subtotal: number;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.TAX_AMOUNT,
        example: ORDER_DTO_EXAMPLES.TAX_AMOUNT,
        default: 0,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber()
    @Min(0, { message: ORDER_VALIDATION_MESSAGES.AMOUNT_MIN })
    taxAmount?: number = 0;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.SHIPPING_AMOUNT,
        example: ORDER_DTO_EXAMPLES.SHIPPING_AMOUNT,
        default: 0,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber()
    @Min(0, { message: ORDER_VALIDATION_MESSAGES.AMOUNT_MIN })
    shippingAmount?: number = 0;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.DISCOUNT_AMOUNT,
        example: ORDER_DTO_EXAMPLES.DISCOUNT_AMOUNT,
        default: 0,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber()
    @Min(0, { message: ORDER_VALIDATION_MESSAGES.AMOUNT_MIN })
    discountAmount?: number = 0;

    @ApiProperty({
        description: ORDER_DTO_DESCRIPTIONS.TOTAL_AMOUNT,
        example: ORDER_DTO_EXAMPLES.TOTAL_AMOUNT,
        minimum: 0,
    })
    @IsNumber()
    @Min(0, { message: ORDER_VALIDATION_MESSAGES.AMOUNT_MIN })
    totalAmount: number;

    @ApiProperty({
        description: ORDER_DTO_DESCRIPTIONS.SHIPPING_ADDRESS,
        type: AddressDto,
    })
    @ValidateNested()
    @Type(() => AddressDto)
    shippingAddress: AddressDto;

    @ApiProperty({
        description: ORDER_DTO_DESCRIPTIONS.EMAIL,
        example: ORDER_DTO_EXAMPLES.EMAIL,
    })
    @IsString()
    @IsEmail({}, { message: ORDER_VALIDATION_MESSAGES.EMAIL_INVALID })
    email: string;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.PAYMENT_DETAILS,
        type: PaymentDetailsDto,
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => PaymentDetailsDto)
    paymentDetails?: PaymentDetailsDto;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.ORDER_NOTES,
        example: ORDER_DTO_EXAMPLES.ORDER_NOTES,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    notes?: string;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.TRACKING_NUMBER,
        example: ORDER_DTO_EXAMPLES.TRACKING_NUMBER,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    trackingNumber?: string;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.ESTIMATED_DELIVERY_DATE,
    })
    @IsOptional()
    @IsDateString({}, { message: ORDER_VALIDATION_MESSAGES.INVALID_DATE_FORMAT })
    estimatedDeliveryDate?: string;
}
