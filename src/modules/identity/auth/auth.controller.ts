import { Controller, Post, Body, Req, Res, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { API_OPERATIONS, API_RESPONSE_MESSAGES } from '../../../common/constants';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserDocument } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { getAccessTokenOptions } from './helpers/jwt.helpers';
import { hasRefreshToken } from '../../../common/utils';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../../common/helpers/jti';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ThrottleAuth, ThrottleSensitive } from '../../../common/decorators/throttle.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService
    ) {}

    @Post('register')
    @ThrottleAuth() // 5 requests per minute
    @ApiOperation({ summary: API_OPERATIONS.AUTH.REGISTER.SUMMARY })
    @ApiResponse({
        status: 201,
        description: API_RESPONSE_MESSAGES.AUTH.USER_REGISTERED,
    })
    async register(@Body() dto: RegisterDto) {
        return await this.authService.register(dto);
    }

    // Email verification with OTP
    @Post('verify-email')
    @ThrottleSensitive() // 3 requests per minute
    @ApiOperation({
        summary: API_OPERATIONS.AUTH.VERIFY_EMAIL_OTP.SUMMARY,
        description: API_OPERATIONS.AUTH.VERIFY_EMAIL_OTP.DESCRIPTION,
    })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.AUTH.EMAIL_VERIFIED_OTP,
    })
    @ApiResponse({
        status: 400,
        description: API_RESPONSE_MESSAGES.AUTH.INVALID_OR_EXPIRED_OTP,
    })
    async verifyEmail(@Body() dto: VerifyOtpDto) {
        return this.authService.verifyEmail(dto);
    }

    @Post('login')
    @ThrottleAuth() // 5 requests per minute
    @ApiOperation({ summary: API_OPERATIONS.AUTH.LOGIN.SUMMARY })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.AUTH.LOGGED_IN,
    })
    async login(@Body() dto: LoginDto, @Req() req: Request, @Res() res: Response) {
        const IP = req.ip ?? 'unknown';
        const device = req.headers['user-agent'] || 'unknown';
        const { accessToken, refreshToken, refreshTokenTtl } = await this.authService.login(
            dto,
            IP,
            device
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: refreshTokenTtl,
            path: '/auth/refresh',
        });
        return res.json({ accessToken });
    }

    @Post('refresh')
    @ApiOperation({ summary: API_OPERATIONS.AUTH.REFRESH.SUMMARY })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.AUTH.TOKENS_ROTATED,
    })
    async refresh(@Body() dto: RefreshDto, @Req() req: Request, @Res() res: Response) {
        // Accept refresh token from cookie only
        const refreshToken: string | undefined = hasRefreshToken(req.cookies)
            ? (req.cookies as { refreshToken: string }).refreshToken
            : undefined;

        if (!refreshToken) {
            return res.status(401).json({ message: API_RESPONSE_MESSAGES.AUTH.NO_REFRESH_TOKEN });
        }
        const IP = req.ip ?? 'unknown';
        const device = req.headers['user-agent'] || 'unknown';
        const {
            accessToken,
            refreshToken: newRefreshToken,
            refreshTokenTtl,
        } = await this.authService.refresh({ refreshToken }, IP, device);
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: refreshTokenTtl,
            path: '/auth/refresh',
        });
        return res.json({ accessToken });
    }

    @Post('logout')
    @ApiOperation({ summary: API_OPERATIONS.AUTH.LOGOUT.SUMMARY })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.AUTH.USER_LOGGED_OUT,
    })
    async logout(@Req() req: Request, @Res() res: Response) {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({ message: API_RESPONSE_MESSAGES.AUTH.NO_ACCESS_TOKEN });
        }
        let userID: string | null = null;
        try {
            const payload = this.jwtService.verify<JwtPayload>(
                accessToken,
                getAccessTokenOptions()
            );
            userID = payload.sub;
        } catch {
            return res.status(401).json({
                message: API_RESPONSE_MESSAGES.AUTH.INVALID_ACCESS_TOKEN,
            });
        }
        const cookieRefreshToken = hasRefreshToken(req.cookies)
            ? req.cookies.refreshToken
            : undefined;
        const bodyRefreshToken = hasRefreshToken(req.body) ? req.body.refreshToken : undefined;
        const refreshToken: string | undefined = cookieRefreshToken || bodyRefreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: API_RESPONSE_MESSAGES.AUTH.NO_REFRESH_TOKEN });
        }
        if (!userID) {
            return res.status(401).json({ message: API_RESPONSE_MESSAGES.AUTH.INVALID_USER_ID });
        }
        await this.authService.logout(userID, refreshToken);
        res.clearCookie('refreshToken', { path: '/auth/refresh' });
        return res.json({ message: API_RESPONSE_MESSAGES.AUTH.LOGGED_OUT });
    }

    // Forgot password
    @Post('forgot-password')
    @ThrottleSensitive() // 3 requests per minute
    @ApiOperation({ summary: API_OPERATIONS.AUTH.FORGOT_PASSWORD.SUMMARY })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.AUTH.RESET_EMAIL_SENT,
    })
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto);
    }

    // Reset password
    @Post('reset-password')
    @ThrottleSensitive() // 3 requests per minute
    @ApiOperation({
        summary: API_OPERATIONS.AUTH.RESET_PASSWORD_OTP.SUMMARY,
        description: API_OPERATIONS.AUTH.RESET_PASSWORD_OTP.DESCRIPTION,
    })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.AUTH.PASSWORD_RESET_OTP,
    })
    @ApiResponse({
        status: 400,
        description: API_RESPONSE_MESSAGES.AUTH.INVALID_OR_EXPIRED_OTP,
    })
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }

    // OAuth2 endpoints - Google
    @Get('google')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: API_OPERATIONS.AUTH.GOOGLE_AUTH.SUMMARY })
    googleAuth(): void {}

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: API_OPERATIONS.AUTH.GOOGLE_CALLBACK.SUMMARY })
    async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
        if (!req.user) {
            return res.status(401).json({
                message: API_RESPONSE_MESSAGES.AUTH.GOOGLE_AUTH_FAILED,
            });
        }

        const user = req.user as UserDocument;
        const { accessToken, refreshToken, refreshTokenTtlMs } = await this.authService.issueTokens(
            user,
            req.ip || 'unknown',
            req.headers['user-agent'] || 'unknown'
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: refreshTokenTtlMs,
            path: '/auth/refresh',
        });

        // Redirect to frontend with token
        let frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        if (!frontendUrl.startsWith('http')) {
            frontendUrl = `https://${frontendUrl}`;
        }
        return res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
    }

    // Resend OTP for email verification
    @Post('resend-verification-otp')
    @ThrottleSensitive() // 3 requests per minute to prevent OTP spam
    @ApiOperation({
        summary: API_OPERATIONS.AUTH.RESEND_VERIFICATION_OTP.SUMMARY,
        description: API_OPERATIONS.AUTH.RESEND_VERIFICATION_OTP.DESCRIPTION,
    })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.AUTH.NEW_OTP_SENT,
    })
    async resendVerificationOtp(@Body() dto: ResendOtpDto) {
        return this.authService.resendVerificationOtp(dto);
    }
}
