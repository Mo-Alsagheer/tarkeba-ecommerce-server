import { Model, Types } from 'mongoose';
import { Otp, OtpDocument } from '../entities/otp.entity';
import { OtpType } from '../../../../common/enums';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OtpHelper {
    constructor(@InjectModel(Otp.name) private otpModel: Model<Otp>) {}

    /**
     * Generate a random 6-digit OTP code
     */
    generateOtpCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Create and save OTP to database
     */
    async createOtp(
        userId: Types.ObjectId,
        type: OtpType,
        expiryMinutes: number = 10
    ): Promise<OtpDocument> {
        const code = this.generateOtpCode();
        const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

        const otp = new this.otpModel({
            userId,
            code,
            type,
            expiresAt,
            isUsed: false,
        });

        await otp.save();
        return otp;
    }

    /**
     * Validate OTP code
     */
    async validateOtp(userId: Types.ObjectId, code: string, type: OtpType): Promise<OtpDocument> {
        const otp = await this.otpModel.findOne({
            userId,
            code,
            type,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        });

        if (!otp) {
            throw new BadRequestException('Invalid or expired OTP code');
        }

        return otp;
    }

    /**
     * Mark OTP as used
     */
    async markOtpAsUsed(otp: OtpDocument): Promise<void> {
        otp.isUsed = true;
        otp.usedAt = new Date();
        await otp.save();
    }

    /**
     * Invalidate all unused OTPs for a user and type
     */
    async invalidateUserOtps(userId: Types.ObjectId, type: OtpType): Promise<void> {
        await this.otpModel.updateMany(
            {
                userId,
                type,
                isUsed: false,
            },
            {
                $set: { isUsed: true, usedAt: new Date() },
            }
        );
    }
}
