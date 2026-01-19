import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

export enum PaymentStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
}

export enum PaymentMethod {
    WALLET = 'wallet',
    CASH_ON_DELIVERY = 'cash_on_delivery',
}

export enum PaymentProvider {
    PAYMOB = 'paymob',
    INTERNAL = 'internal', // For COD
}

@Schema({ timestamps: true })
export class Payment {
    @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
    orderId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, default: 'EGP' })
    currency: string;

    @Prop({ required: true, enum: PaymentMethod })
    paymentMethod: PaymentMethod;

    @Prop({
        required: true,
        enum: PaymentProvider,
        default: PaymentProvider.PAYMOB,
    })
    provider: PaymentProvider;

    @Prop({
        required: true,
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    status: PaymentStatus;

    // Paymob specific fields
    @Prop()
    paymobOrderId: string;

    @Prop()
    paymobTransactionId: string;

    @Prop()
    paymobIntentionId: string;

    @Prop()
    paymobPaymentKey: string;

    @Prop()
    paymobIframeUrl: string;

    // Transaction details
    @Prop()
    transactionReference: string;

    @Prop()
    gatewayReference: string;

    @Prop()
    authCode: string;

    @Prop()
    maskedPan: string; // Masked card number for cards

    @Prop()
    walletMsisdn: string; // Phone number for e-wallets

    // Timestamps
    @Prop()
    paidAt: Date;

    @Prop()
    failedAt: Date;

    @Prop()
    refundedAt: Date;

    // Error handling
    @Prop()
    errorCode: string;

    @Prop()
    errorMessage: string;

    // Webhook data
    @Prop({ type: Object })
    webhookData: Record<string, any>;

    // Fees and charges
    @Prop({ default: 0 })
    processingFee: number;

    @Prop({ default: 0 })
    gatewayFee: number;

    // Metadata
    @Prop({ type: Object })
    metadata: Record<string, any>;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Indexes for better performance
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ paymentMethod: 1 });
PaymentSchema.index({ provider: 1 });
PaymentSchema.index({ paymobOrderId: 1 });
PaymentSchema.index({ paymobTransactionId: 1 });
PaymentSchema.index({ transactionReference: 1 });
PaymentSchema.index({ createdAt: -1 });
PaymentSchema.index({ paidAt: -1 });
