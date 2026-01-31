import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PageDocument = Page & Document;

@Schema({ timestamps: true })
export class Page {
    @Prop({ required: true, unique: true })
    slug: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ maxlength: 160 })
    metaDescription?: string;

    @Prop({ default: true })
    isPublished: boolean;

    createdAt: Date;

    updatedAt: Date;
}

export const PageSchema = SchemaFactory.createForClass(Page);

// Indexes for performance
PageSchema.index({ isPublished: 1 });
PageSchema.index({ createdAt: -1 });
PageSchema.index({ title: 'text', content: 'text' }); // For search
