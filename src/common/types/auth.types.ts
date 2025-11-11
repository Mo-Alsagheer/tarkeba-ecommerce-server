import { UserRole, TokenType, SessionStatus } from '../enums';
import { ObjectId } from './common.types';

export type JwtPayload = {
    sub: ObjectId;
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
    jti?: string;
    type: TokenType;
    aud?: string;
    iss?: string;
};

export type RefreshTokenPayload = {
    sub: ObjectId;
    jti: string;
    type: TokenType.REFRESH;
    iat: number;
    exp: number;
};

export type TokenPair = {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: 'Bearer';
};

export type LoginCredentials = {
    email: string;
    password: string;
    rememberMe?: boolean;
};

export type RegisterData = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    acceptTerms: boolean;
};

export type PasswordResetRequest = {
    email: string;
};

export type PasswordResetConfirm = {
    token: string;
    newPassword: string;
};

export type SessionInfo = {
    id: ObjectId;
    userId: ObjectId;
    jtiHash: string;
    deviceInfo?: string;
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    status: SessionStatus;
    createdAt: Date;
    expiresAt: Date;
    lastUsedAt?: Date;
};

export type LoginAttempt = {
    email: string;
    ipAddress: string;
    userAgent: string;
    success: boolean;
    failureReason?: string;
    timestamp: Date;
};

export type SecuritySettings = {
    twoFactorEnabled: boolean;
    loginNotifications: boolean;
    sessionTimeout: number;
    allowedDevices: string[];
};
