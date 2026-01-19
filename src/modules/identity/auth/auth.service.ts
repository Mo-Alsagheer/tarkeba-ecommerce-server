import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { OtpType } from '../../../common/enums';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload, hashJti } from '../../../common/helpers/jti';
import { OtpHelper } from './helpers/otp.helper';
import { getEmailFromProfile, getDisplayNameFromProfile } from './helpers/oauth.helper';
import { issueTokensHelper } from './helpers/issue-tokens.helper';
import { EmailProducerService } from '../../messaging/queue/producers/email-producer.service';
import { getRefreshTokenOptions } from '../../../config';
import { MESSAGES } from '../../../common/constants';
import { revokeAllUserRefreshTokens } from './helpers/refresh.helper';
import { IOAuthProfile } from '../../../common/interfaces';
import { generateOAuthPassword } from './helpers/generate-password.helper';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly otpHelper: OtpHelper,
        @InjectModel(RefreshToken.name)
        private refreshTokenModel: Model<RefreshToken>,
        private readonly jwtService: JwtService,
        private readonly emailProducerService: EmailProducerService,
        private readonly configService: ConfigService
    ) {}

    // Register a new user
    async register(registerDto: RegisterDto) {
        // Check if user already exists
        const existing = await this.userModel.findOne({
            email: registerDto.email,
        });
        if (existing) {
            throw new BadRequestException(MESSAGES.USER.EMAIL_EXISTS);
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 12);
        const user = new this.userModel({
            username: registerDto.username,
            email: registerDto.email,
            password: hashedPassword,
        });

        await user.save();
        this.logger.log(`${MESSAGES.LOGGER.NEW_USER_REGISTERED}: ${user.email}`);

        // Generate OTP and send email
        try {
            const otp = await this.otpHelper.createOtp(user._id, OtpType.EMAIL_VERIFICATION);
            await this.emailProducerService.addVerificationEmailJob({
                to: user.email,
                username: user.username,
                otpCode: otp.code,
                expiresInMinutes: 10,
            });
        } catch (error) {
            this.logger.error(MESSAGES.LOGGER.FAILED_TO_ENQUEUE_VERIFICATION_EMAIL, error);
        }

        return {
            _id: user._id,
            email: user.email,
            username: user.username,
            roles: user.roles,
        };
    }

    // Email verification with OTP
    async verifyEmail(verifyOtpDto: VerifyOtpDto) {
        // Find user by email
        const user = await this.userModel.findOne({ email: verifyOtpDto.email });
        if (!user) {
            throw new BadRequestException(MESSAGES.USER.NOT_FOUND);
        }

        // Validate OTP
        const otp = await this.otpHelper.validateOtp(
            user._id,
            verifyOtpDto.code,
            OtpType.EMAIL_VERIFICATION
        );

        // Mark OTP as used
        await this.otpHelper.markOtpAsUsed(otp);

        // Set isVerified to true
        user.isVerified = true;
        await user.save();
        this.logger.log(`${MESSAGES.AUTH.EMAIL_VERIFIED}: ${user.email}`);
        return { message: MESSAGES.AUTH.EMAIL_VERIFIED };
    }

    // Login user and issue tokens
    async login(loginDto: LoginDto, ip: string, device: string) {
        const user = await this.userModel.findOne({ email: loginDto.email });

        // Check if user exists
        if (!user) {
            throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);
        }

        // Check if user is verified
        if (!user.isVerified) {
            throw new UnauthorizedException(MESSAGES.AUTH.EMAIL_NOT_VERIFIED);
        }

        // Check if password is valid
        const passwordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);
        }

        // Return issue tokens
        return issueTokensHelper(this.jwtService, this.refreshTokenModel, user, ip, device);
    }

    // Refresh token flow
    async refresh(refreshDto: RefreshDto, presentedIp: string, presentedDevice: string) {
        // Check if refresh token is provided
        if (!refreshDto.refreshToken) {
            throw new UnauthorizedException(MESSAGES.AUTH.REFRESH_TOKEN_MISSING);
        }

        // 1. Decode and verify signature
        let payload: JwtPayload;
        try {
            payload = this.jwtService.verify(refreshDto.refreshToken, getRefreshTokenOptions());
        } catch {
            // invalid token
            throw new UnauthorizedException(MESSAGES.AUTH.UNAUTHORIZED);
        }

        // 2. Find the matching hashed jti in DB
        const presentedJtiHash = hashJti(payload.jti);
        const dbToken = await this.refreshTokenModel.findOne({
            jtiHash: presentedJtiHash,
            userId: payload.sub,
        });

        if (!dbToken) {
            // Token reuse/theft (or expired), nuke all sessions for this user
            await revokeAllUserRefreshTokens(this.refreshTokenModel, payload.sub);
            throw new UnauthorizedException(MESSAGES.AUTH.REFRESH_TOKEN_EXPIRED);
        }

        // 3. Rotate: remove the used token
        await dbToken.deleteOne();

        // 4. Look up the user (ensure still exists and not disabled)
        const user = await this.userModel.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException(MESSAGES.USER.NOT_FOUND);
        }

        // 5. Issue new tokens (and new jti), store new in DB
        return issueTokensHelper(
            this.jwtService,
            this.refreshTokenModel,
            user,
            presentedIp,
            presentedDevice
        );
    }

    // Logout, revoke refresh token
    async logout(userId: string, presentedRefreshToken: string) {
        // Extract jti from the refresh token (verify signature)
        let payload: JwtPayload;
        try {
            payload = this.jwtService.verify(presentedRefreshToken, getRefreshTokenOptions());
        } catch {
            // invalid token
            throw new UnauthorizedException(MESSAGES.AUTH.UNAUTHORIZED);
        }

        // Find the matching hashed jti in DB and delete it
        const presentedJtiHash = hashJti(payload.jti);
        const deleted = await this.refreshTokenModel.findOneAndDelete({
            userId,
            jtiHash: presentedJtiHash,
        });

        // If token is not found, throw unauthorized
        if (!deleted) {
            throw new UnauthorizedException(MESSAGES.AUTH.UNAUTHORIZED);
        }

        return { message: MESSAGES.AUTH.LOGOUT_SUCCESS };
    }

    // Forgot password initiates reset flow
    async forgotPassword(forgetPasswordDto: ForgotPasswordDto) {
        const user = await this.userModel.findOne({
            email: forgetPasswordDto.email,
        });

        if (user) {
            // Generate OTP and send email
            try {
                // Invalidate old OTPs and create new one
                await this.otpHelper.invalidateUserOtps(user._id, OtpType.PASSWORD_RESET);
                const otp = await this.otpHelper.createOtp(user._id, OtpType.PASSWORD_RESET);
                await this.emailProducerService.addPasswordResetEmailJob({
                    to: user.email,
                    username: user.username,
                    otpCode: otp.code,
                    expiresInMinutes: 10,
                });
            } catch (e) {
                this.logger.error(MESSAGES.LOGGER.FAILED_TO_ENQUEUE_RESET_EMAIL, e);
            }
        }

        // Always respond successfully for anti-enumeration
        return { message: MESSAGES.AUTH.PASSWORD_RESET_EMAIL_SENT };
    }

    // Reset password with OTP
    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        // Find user by email
        const user = await this.userModel.findOne({ email: resetPasswordDto.email });
        if (!user) {
            throw new BadRequestException(MESSAGES.AUTH.INVALID_OR_EXPIRED_OTP);
        }

        // Validate OTP
        const otp = await this.otpHelper.validateOtp(
            user._id,
            resetPasswordDto.code,
            OtpType.PASSWORD_RESET
        );

        // Mark OTP as used
        await this.otpHelper.markOtpAsUsed(otp);

        // Hash new password and save
        const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        // Revoke all refresh tokens for security (force re-login)
        await revokeAllUserRefreshTokens(this.refreshTokenModel, user._id.toString());

        this.logger.log(`${MESSAGES.AUTH.PASSWORD_RESET_SUCCESSFUL}: ${user.email}`);
        return { message: MESSAGES.AUTH.PASSWORD_RESET_SUCCESSFUL };
    }

    // OAuth user processing
    async oauthLogin(profile: IOAuthProfile): Promise<UserDocument> {
        const email = getEmailFromProfile(profile);
        console.log(profile);
        if (!email) {
            throw new BadRequestException(MESSAGES.AUTH.OAUTH_NO_EMAIL);
        }

        // Generate OAuth password
        const oauthPassword = generateOAuthPassword(email);

        // Check if user exists with this email
        let user = await this.userModel.findOne({ email });

        if (user) {
            // User exists, validate OAuth password
            const passwordValid = await bcrypt.compare(oauthPassword, user.password);
            if (!passwordValid) {
                throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);
            }

            // Update OAuth provider info
            if (!user.oauth) user.oauth = {};
            user.oauth.googleID = profile.id;
            await user.save();
        } else {
            // Create new user with hashed OAuth password
            const hashedPassword = await bcrypt.hash(oauthPassword, 12);
            user = new this.userModel({
                email,
                username: getDisplayNameFromProfile(profile),
                password: hashedPassword,
                oauth: {
                    googleID: profile.id,
                },
                isVerified: true,
            });
            await user.save();
            this.logger.log(`${MESSAGES.LOGGER.NEW_USER_REGISTERED}: ${user.email} via google`);
        }

        return user as UserDocument;
    }

    // Resend OTP for email verification
    async resendVerificationOtp(resendOtpDto: ResendOtpDto) {
        const user = await this.userModel.findOne({ email: resendOtpDto.email });
        if (!user) {
            // Note: Don't reveal if user exists for security
            return { message: MESSAGES.AUTH.NEW_OTP_SENT };
        }

        if (user.isVerified) {
            throw new BadRequestException(MESSAGES.AUTH.EMAIL_ALREADY_VERIFIED);
        }

        // Invalidate old OTPs and create new one
        await this.otpHelper.invalidateUserOtps(user._id, OtpType.EMAIL_VERIFICATION);
        const otp = await this.otpHelper.createOtp(user._id, OtpType.EMAIL_VERIFICATION);

        try {
            await this.emailProducerService.addVerificationEmailJob({
                to: user.email,
                username: user.username,
                otpCode: otp.code,
                expiresInMinutes: 10,
            });
        } catch (error) {
            this.logger.error(MESSAGES.LOGGER.FAILED_TO_SEND_OTP, error);
            throw new BadRequestException(MESSAGES.AUTH.FAILED_TO_SEND_OTP);
        }

        return { message: MESSAGES.AUTH.RESEND_OTP_SUCCESS };
    }

    // Issue tokens for a user
    async issueTokens(user: UserDocument, ip: string, device: string) {
        const result = await issueTokensHelper(
            this.jwtService,
            this.refreshTokenModel,
            user,
            ip,
            device
        );

        // Return with consistent property name
        return {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            refreshTokenTtlMs: result.refreshTokenTtl,
        };
    }
}
