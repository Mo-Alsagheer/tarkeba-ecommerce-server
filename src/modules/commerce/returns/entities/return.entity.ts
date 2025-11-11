import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ReturnStatus, ReturnReason, RefundMethod } from '../../../../common/enums/return.enum';

export type ReturnDocument = Return & Document;

@Schema({ timestamps: true })
export class Return {
    @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
    orderId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productId: Types.ObjectId;

    @Prop({ required: true, min: 1 })
    quantity: number;

    @Prop({ required: true, enum: ReturnReason })
    reason: ReturnReason;

    @Prop({ required: true, minlength: 10, maxlength: 500 })
    description: string;

    @Prop({ default: ReturnStatus.PENDING, enum: ReturnStatus })
    status: ReturnStatus;

    @Prop({ enum: RefundMethod, default: RefundMethod.ORIGINAL_PAYMENT })
    refundMethod: RefundMethod;

    @Prop({ required: true, min: 0 })
    refundAmount: number;

    @Prop()
    trackingNumber?: string;

    @Prop()
    adminNotes?: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    processedBy?: Types.ObjectId;

    @Prop()
    processedAt?: Date;

    @Prop()
    refundedAt?: Date;

    @Prop()
    expectedReturnDate?: Date;

    createdAt: Date;

    updatedAt: Date;
}

export const ReturnSchema = SchemaFactory.createForClass(Return);

// Indexes for performance
ReturnSchema.index({ orderId: 1, status: 1 });
ReturnSchema.index({ userId: 1, createdAt: -1 });
ReturnSchema.index({ status: 1, createdAt: -1 });
ReturnSchema.index({ productId: 1 });
ReturnSchema.index({ trackingNumber: 1 });
