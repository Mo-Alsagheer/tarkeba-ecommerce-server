import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PaymentTransactionDocument = PaymentTransaction & Document;

export enum PaymentStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
    PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum PaymentMethod {
    CARD = 'card',
    WALLET = 'wallet',
    BANK_INSTALLMENTS = 'bank_installments',
    KIOSK = 'kiosk',
}

@Schema({ timestamps: true })
export class PaymentTransaction {
    @ApiProperty({ description: 'Order ID associated with this payment' })
    @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
    orderId: Types.ObjectId;

    @ApiProperty({ description: 'User ID who initiated the payment' })
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @ApiProperty({ description: 'Paymob order ID' })
    @Prop({ required: true })
    paymobOrderId: string;

    @ApiProperty({ description: 'Paymob payment key token' })
    @Prop({ required: true })
    paymentKeyToken: string;

    @ApiProperty({ description: 'Paymob transaction ID (from webhook)' })
    @Prop()
    paymobTransactionId?: string;

    @ApiProperty({ description: 'Payment amount in cents' })
    @Prop({ required: true, min: 0 })
    amountCents: number;

    @ApiProperty({ description: 'Currency code (e.g., EGP, USD)' })
    @Prop({ required: true, default: 'EGP' })
    currency: string;

    @ApiProperty({ enum: PaymentStatus, description: 'Payment status' })
    @Prop({
        required: true,
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    status: PaymentStatus;

    @ApiProperty({ enum: PaymentMethod, description: 'Payment method used' })
    @Prop({ enum: PaymentMethod })
    paymentMethod?: PaymentMethod;

    @ApiProperty({
        description: 'Idempotency key to prevent duplicate payments',
    })
    @Prop({ required: true, unique: true })
    idempotencyKey: string;

    @ApiProperty({ description: 'Paymob integration ID used for payment' })
    @Prop({ required: true })
    integrationId: number;

    @ApiProperty({ description: 'Payment gateway response data' })
    @Prop({ type: Object })
    gatewayResponse?: Record<string, any>;

    @ApiProperty({ description: 'Webhook data received from Paymob' })
    @Prop({ type: Object })
    webhookData?: Record<string, any>;

    @ApiProperty({ description: 'Payment failure reason' })
    @Prop()
    failureReason?: string;

    @ApiProperty({ description: 'Refund amount in cents' })
    @Prop({ default: 0, min: 0 })
    refundedAmountCents: number;

    @ApiProperty({ description: 'Refund transactions' })
    @Prop([
        {
            refundId: String,
            amountCents: Number,
            reason: String,
            processedAt: Date,
            paymobRefundId: String,
        },
    ])
    refunds: Array<{
        refundId: string;
        amountCents: number;
        reason: string;
        processedAt: Date;
        paymobRefundId?: string;
    }>;

    @ApiProperty({ description: 'Payment processed timestamp' })
    @Prop()
    processedAt?: Date;

    @ApiProperty({ description: 'Payment expiry timestamp' })
    @Prop()
    expiresAt?: Date;

    @ApiProperty({ description: 'Additional metadata' })
    @Prop({ type: Object })
    metadata?: Record<string, any>;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp' })
    updatedAt: Date;
}

export const PaymentTransactionSchema = SchemaFactory.createForClass(PaymentTransaction);

// Indexes for performance
PaymentTransactionSchema.index({ orderId: 1 });
PaymentTransactionSchema.index({ userId: 1, createdAt: -1 });
PaymentTransactionSchema.index({ paymobOrderId: 1 });
PaymentTransactionSchema.index({ paymobTransactionId: 1 });
PaymentTransactionSchema.index({ idempotencyKey: 1 }, { unique: true });
PaymentTransactionSchema.index({ status: 1, createdAt: -1 });
