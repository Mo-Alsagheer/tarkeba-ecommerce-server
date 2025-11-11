import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ trim: true })
    description?: string;

    @Prop({ required: true, unique: true, lowercase: true })
    slug: string;

    @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
    parentID?: Types.ObjectId;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: 0 })
    sortOrder: number;

    @Prop()
    image?: string;

    @Prop({ type: Object })
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };

    @Prop({ default: 0 })
    productCount: number;

    @Prop([String])
    tags?: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Create indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parentId: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ name: 'text', description: 'text' });
