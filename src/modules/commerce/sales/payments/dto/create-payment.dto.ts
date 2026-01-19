import { IsString, IsNumber, IsOptional, Min, IsObject, IsEnum, IsMongoId, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';

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

    @ValidateIf((o) => o.paymentMethod === PaymentMethod.WALLET)
    @IsString()
    walletMsisdn?: string; // Required for wallet payments

    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}

export class PaymentResponse {
    paymentId: string;
    paymobOrderId?: string;
    paymentKey?: string;
    redirectUrl?: string;
    expiresAt?: Date;
    paymentMethod?: PaymentMethod;
    status?: PaymentStatus;
    message?: string;
}
