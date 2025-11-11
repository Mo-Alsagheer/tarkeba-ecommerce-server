import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsDateString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus, PaymentStatus } from '../entities/order.entity';
import {
    ORDER_DTO_DESCRIPTIONS,
    ORDER_DTO_EXAMPLES,
    ORDER_VALIDATION_MESSAGES,
} from '../../../../../common/constants';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.ORDER_STATUS,
        enum: OrderStatus,
    })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.PAYMENT_STATUS,
        enum: PaymentStatus,
    })
    @IsOptional()
    @IsEnum(PaymentStatus)
    paymentStatus?: PaymentStatus;

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

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.DELIVERED_AT,
    })
    @IsOptional()
    @IsDateString({}, { message: ORDER_VALIDATION_MESSAGES.INVALID_DATE_FORMAT })
    deliveredAt?: string;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.CANCELLED_AT,
    })
    @IsOptional()
    @IsDateString({}, { message: ORDER_VALIDATION_MESSAGES.INVALID_DATE_FORMAT })
    cancelledAt?: string;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.CANCEL_REASON,
        example: ORDER_DTO_EXAMPLES.CANCEL_REASON,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    cancelReason?: string;
}
