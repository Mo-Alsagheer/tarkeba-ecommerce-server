import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../../../common/enums';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, lowercase: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    username: string;

    @Prop({
        type: [String],
        enum: [UserRole.CUSTOMER, UserRole.ADMIN],
        default: [UserRole.CUSTOMER],
    })
    roles: string[];

    @Prop({ default: false })
    isVerified: boolean;

    @Prop({ type: Object, default: {} })
    oauth?: {
        googleID?: string;
    };
}

export const UserSchema = SchemaFactory.createForClass(User);
