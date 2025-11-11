import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CouponUsageDocument = CouponUsage & Document;

@Schema({ timestamps: true })
export class CouponUsage {
    @Prop({ type: Types.ObjectId, ref: 'Coupon', required: true })
    couponID: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userID: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
    orderID: Types.ObjectId;

    @Prop({ required: true, min: 0 })
    discountAmount: number;

    @Prop({ required: true, min: 0 })
    originalAmount: number;

    @Prop({ required: true, min: 0 })
    finalAmount: number;

    createdAt: Date;

    updatedAt: Date;
}

export const CouponUsageSchema = SchemaFactory.createForClass(CouponUsage);

// Indexes for performance and uniqueness
CouponUsageSchema.index({ couponID: 1, userID: 1 });
CouponUsageSchema.index({ couponID: 1, orderID: 1 }, { unique: true });
CouponUsageSchema.index({ userID: 1, createdAt: -1 });
