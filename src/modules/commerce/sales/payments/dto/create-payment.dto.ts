import { IsString, IsNumber, IsOptional, Min, IsObject, IsEnum, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../entities/payment.entity';

export class CreatePaymentDto {
    @IsString()
    @IsMongoId()
    orderID: string;

    @IsNumber()
    @Min(0.01)
    @Type(() => Number)
    amount: number;

    @IsOptional()
    @IsString()
    currency?: string = 'EGP';

    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @IsOptional()
    @IsString()
    walletMsisdn?: string; // Required for e-wallets

    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}

export class PaymentResponse {
    paymentId: string;
    paymobOrderId: string;
    paymentKey: string;
    iframeUrl?: string;
    redirectUrl?: string;
    expiresAt: Date;
}
