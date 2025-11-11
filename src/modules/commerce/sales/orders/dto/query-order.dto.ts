import { IsOptional, IsString, IsEnum, IsNumber, Min, Max, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from '../entities/order.entity';
import { OrderSortBy, SortOrder } from '../../../../../common/enums';
import {
    ORDER_DTO_DESCRIPTIONS,
    ORDER_DTO_EXAMPLES,
    ORDER_VALIDATION_MESSAGES,
} from '../../../../../common/constants';

export class QueryOrderDto {
    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.PAGE,
        example: ORDER_DTO_EXAMPLES.PAGE,
        default: 1,
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1, { message: ORDER_VALIDATION_MESSAGES.PAGE_MIN })
    page?: number = 1;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.LIMIT,
        example: ORDER_DTO_EXAMPLES.LIMIT,
        default: 10,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1, { message: ORDER_VALIDATION_MESSAGES.LIMIT_MIN })
    @Max(100, { message: ORDER_VALIDATION_MESSAGES.LIMIT_MAX })
    limit?: number = 10;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.SEARCH,
        example: ORDER_DTO_EXAMPLES.SEARCH,
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.FILTER_USER_ID,
        example: ORDER_DTO_EXAMPLES.USER_ID,
    })
    @IsOptional()
    @IsString()
    userID?: string;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.FILTER_STATUS,
        enum: OrderStatus,
    })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.FILTER_PAYMENT_STATUS,
        enum: PaymentStatus,
    })
    @IsOptional()
    @IsEnum(PaymentStatus)
    paymentStatus?: PaymentStatus;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.START_DATE,
    })
    @IsOptional()
    @IsDateString({}, { message: ORDER_VALIDATION_MESSAGES.INVALID_DATE_FORMAT })
    startDate?: string;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.END_DATE,
    })
    @IsOptional()
    @IsDateString({}, { message: ORDER_VALIDATION_MESSAGES.INVALID_DATE_FORMAT })
    endDate?: string;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.SORT_BY,
        enum: OrderSortBy,
        default: OrderSortBy.CREATED_AT,
    })
    @IsOptional()
    @IsEnum(OrderSortBy)
    sortBy?: OrderSortBy = OrderSortBy.CREATED_AT;

    @ApiPropertyOptional({
        description: ORDER_DTO_DESCRIPTIONS.SORT_ORDER,
        enum: SortOrder,
        default: SortOrder.DESC,
    })
    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder = SortOrder.DESC;
}
