import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderItemDocument = OrderItem & Document;

@Schema({ timestamps: true })
export class OrderItem {
    @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
    orderID: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productID: Types.ObjectId;

    @Prop({ required: true, trim: true })
    productName: string;

    @Prop({ required: true })
    productSlug: string;

    @Prop()
    productImage?: string;

    @Prop({ required: true, trim: true })
    size: string;

    @Prop({ required: true, min: 1 })
    quantity: number;

    @Prop({ required: true, min: 0 })
    unitPrice: number;

    @Prop({ required: true, min: 0 })
    totalPrice: number;

    @Prop({ type: Object })
    productSnapshot?: {
        description?: string;
        categories?: Types.ObjectId[];
    };
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

// Create indexes
OrderItemSchema.index({ orderID: 1 });
OrderItemSchema.index({ productID: 1 });
OrderItemSchema.index({ orderID: 1, productID: 1 });
