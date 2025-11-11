import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CouponDocument = Coupon & Document;

export enum CouponType {
    PERCENTAGE = 'percentage',
    FIXED_AMOUNT = 'fixed_amount',
    FREE_SHIPPING = 'free_shipping',
}

export enum CouponStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    EXPIRED = 'expired',
}

@Schema({ timestamps: true })
export class Coupon {
    @Prop({ required: true, unique: true, uppercase: true, trim: true })
    code: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, enum: CouponType })
    type: CouponType;

    @Prop({ required: true, min: 0 })
    value: number;

    @Prop({ default: 0, min: 0 })
    minimumOrderAmount: number;

    @Prop({ min: 0 })
    maximumDiscountAmount?: number;

    @Prop({ min: 0 })
    usageLimit?: number;

    @Prop({ default: 0, min: 0 })
    usageCount: number;

    @Prop({ min: 1 })
    usageLimitPerUser?: number;

    @Prop({ required: true })
    startDate: Date;

    @Prop({ required: true })
    expiryDate: Date;

    @Prop({ default: CouponStatus.ACTIVE, enum: CouponStatus })
    status: CouponStatus;

    @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
    applicableProducts: Types.ObjectId[];

    @Prop({ type: [Types.ObjectId], ref: 'Category', default: [] })
    applicableCategories: Types.ObjectId[];

    @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
    excludedProducts: Types.ObjectId[];

    @Prop({ type: [Types.ObjectId], ref: 'Category', default: [] })
    excludedCategories: Types.ObjectId[];

    @Prop({ default: false })
    isStackable: boolean;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: Types.ObjectId;

    createdAt: Date;

    updatedAt: Date;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

// Indexes for performance
CouponSchema.index({ code: 1 });
CouponSchema.index({ status: 1, startDate: 1, expiryDate: 1 });
CouponSchema.index({ applicableProducts: 1 });
CouponSchema.index({ applicableCategories: 1 });
