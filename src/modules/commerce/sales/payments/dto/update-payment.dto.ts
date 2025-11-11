import { IsEnum, IsOptional, IsString, IsObject } from 'class-validator';
import { PaymentStatus } from '../entities/payment.entity';

export class UpdatePaymentDto {
    @IsOptional()
    @IsEnum(PaymentStatus)
    status?: PaymentStatus;

    @IsOptional()
    @IsString()
    transactionReference?: string;

    @IsOptional()
    @IsString()
    gatewayReference?: string;

    @IsOptional()
    @IsString()
    authCode?: string;

    @IsOptional()
    @IsString()
    errorCode?: string;

    @IsOptional()
    @IsString()
    errorMessage?: string;

    @IsOptional()
    @IsObject()
    webhookData?: Record<string, any>;

    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}
