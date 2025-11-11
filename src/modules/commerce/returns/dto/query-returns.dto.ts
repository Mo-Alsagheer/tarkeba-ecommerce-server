import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsNumber, Min, Max, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { ReturnStatus, ReturnReason } from '../../../../common/enums/return.enum';
import { API_DESCRIPTIONS, API_EXAMPLES } from '../../../../common/constants/api-descriptions';

export class QueryReturnsDto {
    @ApiProperty({
        description: API_DESCRIPTIONS.QUERY.PAGE,
        example: API_EXAMPLES.QUERY.PAGE,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiProperty({
        description: API_DESCRIPTIONS.QUERY.LIMIT,
        example: API_EXAMPLES.QUERY.LIMIT,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiProperty({
        description: API_DESCRIPTIONS.RETURN.ORDER_ID,
        example: API_EXAMPLES.RETURN.ORDER_ID,
        required: false,
    })
    @IsOptional()
    @IsString()
    @IsMongoId()
    orderID?: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.RETURN.USER_ID,
        example: API_EXAMPLES.RETURN.USER_ID,
        required: false,
    })
    @IsOptional()
    @IsString()
    @IsMongoId()
    userID?: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.RETURN.PRODUCT_ID,
        example: API_EXAMPLES.RETURN.PRODUCT_ID,
        required: false,
    })
    @IsOptional()
    @IsString()
    @IsMongoId()
    productID?: string;

    @ApiProperty({
        enum: ReturnStatus,
        description: API_DESCRIPTIONS.RETURN.STATUS,
        required: false,
    })
    @IsOptional()
    @IsEnum(ReturnStatus)
    status?: ReturnStatus;

    @ApiProperty({
        enum: ReturnReason,
        description: API_DESCRIPTIONS.RETURN.REASON,
        required: false,
    })
    @IsOptional()
    @IsEnum(ReturnReason)
    reason?: ReturnReason;

    @ApiProperty({
        description: 'Sort by field',
        enum: ['createdAt', 'refundAmount', 'processedAt'],
        required: false,
    })
    @IsOptional()
    @IsString()
    sortBy?: 'createdAt' | 'refundAmount' | 'processedAt';

    @ApiProperty({
        description: 'Sort order',
        enum: ['asc', 'desc'],
        required: false,
    })
    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc' = 'desc';
}
