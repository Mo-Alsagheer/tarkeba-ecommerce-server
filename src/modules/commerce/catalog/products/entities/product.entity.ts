import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, trim: true })
    description: string;

    @Prop({ required: true, unique: true, lowercase: true })
    slug: string;

    @Prop({
        type: [
            {
                size: { type: String, required: true },
                price: { type: Number, required: true, min: 0 },
                comparePrice: { type: Number, min: 0, default: null },
                stock: { type: Number, required: true, min: 0 },
            },
        ],
    })
    variants: {
        size: string;
        price: number;
        comparePrice?: number;
        stock: number;
    }[];

    @Prop([{ type: Types.ObjectId, ref: 'Category' }])
    categories: Types.ObjectId[];

    @Prop([String])
    images: string[];

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: false })
    isFeatured: boolean;

    @Prop({ default: 0, min: 0, max: 5 })
    averageRating: number;

    @Prop({ default: 0, min: 0 })
    reviewCount: number;

    @Prop({ default: 0, min: 0 })
    soldCount: number;

    @Prop({ type: Object })
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };

    @Prop([String])
    tags?: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Create indexes
ProductSchema.index({ slug: 1 });
ProductSchema.index({ categories: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ averageRating: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
