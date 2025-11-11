import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNumber,
    IsNotEmpty,
    Min,
    IsEnum,
    IsOptional,
    IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../entities/payment.entity';
import { API_DESCRIPTIONS, API_EXAMPLES } from '../../../../../common/constants/api-descriptions';

export class InitiatePaymentDto {
    @ApiProperty({
        description: API_DESCRIPTIONS.PAYMENT.ORDER_ID,
        example: API_EXAMPLES.PAYMENT.ORDER_ID,
    })
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    orderId: string;

    @ApiProperty({
        description: API_DESCRIPTIONS.PAYMENT.AMOUNT,
        example: API_EXAMPLES.PAYMENT.AMOUNT,
    })
    @IsNumber()
    @Min(0.01)
    @Type(() => Number)
    amount: number;

    @ApiProperty({
        enum: PaymentMethod,
        description: API_DESCRIPTIONS.PAYMENT.PAYMENT_METHOD,
        example: API_EXAMPLES.PAYMENT.PAYMENT_METHOD,
    })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @ApiProperty({
        description: API_DESCRIPTIONS.PAYMENT.CURRENCY,
        example: API_EXAMPLES.PAYMENT.CURRENCY,
        required: false,
    })
    @IsOptional()
    @IsString()
    currency?: string = 'EGP';

    @ApiProperty({
        description: API_DESCRIPTIONS.PAYMENT.WALLET_MSISDN,
        example: API_EXAMPLES.PAYMENT.WALLET_MSISDN,
        required: false,
    })
    @IsOptional()
    @IsString()
    walletMsisdn?: string; // Required for e-wallets

    @ApiProperty({
        description: API_DESCRIPTIONS.PAYMENT.METADATA,
        example: API_EXAMPLES.PAYMENT.METADATA,
        required: false,
    })
    @IsOptional()
    metadata?: Record<string, any>;
}
