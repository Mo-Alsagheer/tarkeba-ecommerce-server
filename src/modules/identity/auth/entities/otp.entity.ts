import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OtpType } from '../../../../common/enums';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    code: string;

    @Prop({ type: String, enum: Object.values(OtpType), required: true })
    type: OtpType;

    @Prop({ required: true })
    expiresAt: Date;

    @Prop({ default: false })
    isUsed: boolean;

    @Prop()
    usedAt?: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// Index for automatic deletion of expired OTPs
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for efficient queries
OtpSchema.index({ userId: 1, type: 1, isUsed: 1 });
