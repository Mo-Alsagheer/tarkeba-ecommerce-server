import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min, IsEnum, Length, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { ReturnReason, RefundMethod } from '../../../../common/enums/return.enum';
import { API_DESCRIPTIONS, API_EXAMPLES } from '../../../../common/constants/api-descriptions';

export class CreateReturnDto {
    @ApiProperty({
        description: API_DESCRIPTIONS.RETURN.ORDER_ID,
        example: API_EXAMPLES.RETURN.ORDER_ID,
    })
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    orderID: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.RETURN.PRODUCT_ID,
        example: API_EXAMPLES.RETURN.PRODUCT_ID,
    })
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    productID: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.RETURN.QUANTITY,
        example: API_EXAMPLES.RETURN.QUANTITY,
    })
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    quantity: number;

    @ApiProperty({
        enum: ReturnReason,
        description: API_DESCRIPTIONS.RETURN.REASON,
        example: API_EXAMPLES.RETURN.REASON,
    })
    @IsEnum(ReturnReason)
    reason: ReturnReason;

    @ApiProperty({
        description: API_DESCRIPTIONS.RETURN.DESCRIPTION,
        example: API_EXAMPLES.RETURN.DESCRIPTION,
    })
    @IsString()
    @IsNotEmpty()
    @Length(10, 500)
    description: string;

    @ApiProperty({
        enum: RefundMethod,
        description: API_DESCRIPTIONS.RETURN.REFUND_METHOD,
        required: false,
    })
    @IsEnum(RefundMethod)
    refundMethod: RefundMethod = RefundMethod.ORIGINAL_PAYMENT;

    @ApiProperty({
        description: API_DESCRIPTIONS.RETURN.REFUND_AMOUNT,
        example: API_EXAMPLES.RETURN.REFUND_AMOUNT,
    })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    refundAmount: number;
}
