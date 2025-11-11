import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

export enum ReviewStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class Review {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
    orderId: Types.ObjectId;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop({ required: true, minlength: 10, maxlength: 1000 })
    comment: string;

    @Prop({ default: ReviewStatus.PENDING, enum: ReviewStatus })
    status: ReviewStatus;

    createdAt: Date;

    updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Indexes for performance
ReviewSchema.index({ productId: 1, status: 1 });
ReviewSchema.index({ userId: 1, createdAt: -1 });
ReviewSchema.index({ orderId: 1 });
ReviewSchema.index({ status: 1, createdAt: -1 });
ReviewSchema.index({ productId: 1, rating: 1 });
ReviewSchema.index({ parentReviewId: 1 });

// Ensure one review per user per product per order
ReviewSchema.index({ productId: 1, userId: 1, orderId: 1 }, { unique: true });
