import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true, unique: true })
    orderNumber: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userID: Types.ObjectId;

    @Prop({
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @Prop({
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
    })
    paymentStatus: PaymentStatus;

    @Prop({ required: true, min: 0 })
    subtotal: number;

    @Prop({ default: 0, min: 0 })
    taxAmount: number;

    @Prop({ default: 0, min: 0 })
    shippingAmount: number;

    @Prop({ default: 0, min: 0 })
    discountAmount: number;

    @Prop({ required: true, min: 0 })
    totalAmount: number;

    @Prop({ type: Object, required: true })
    shippingAddress: {
        customerName: string;
        addressLine1: string;
        city: string;
        state: string;
        phone?: string;
    };

    @Prop({ type: Object })
    paymentDetails?: {
        method: string;
        transactionId?: string;
        paymentIntentId?: string;
        last4?: string;
        brand?: string;
    };

    @Prop()
    notes?: string;

    @Prop()
    trackingNumber?: string;

    @Prop()
    estimatedDeliveryDate?: Date;

    @Prop()
    deliveredAt?: Date;

    @Prop()
    cancelledAt?: Date;

    @Prop()
    cancelReason?: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Create indexes
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ userId: 1, createdAt: -1 });
