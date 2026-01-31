import { UserRole, TokenType } from '../enums';
import { ObjectId, TokenPair, LoginCredentials, RegisterData } from '../types';

export interface IAuthService {
    register(registerData: RegisterData): Promise<{ user: any; tokens: TokenPair }>;
    login(credentials: LoginCredentials): Promise<{ user: any; tokens: TokenPair }>;
    refresh(refreshToken: string): Promise<TokenPair>;
    logout(refreshToken: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    verifyEmail(token: string): Promise<void>;
    revokeAllTokens(userId: string): Promise<void>;
}

export interface ITokenService {
    generateTokenPair(userId: ObjectId, role: UserRole): Promise<TokenPair>;
    verifyAccessToken(token: string): Promise<any>;
    verifyRefreshToken(token: string): Promise<any>;
    revokeRefreshToken(jti: string): Promise<void>;
    generateResetToken(userId: ObjectId): Promise<string>;
    verifyResetToken(token: string): Promise<ObjectId>;
}

export interface IRefreshToken {
    id: ObjectId;
    userId: ObjectId;
    jtiHash: string;
    deviceInfo?: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
    createdAt: Date;
    lastUsedAt?: Date;
}

export interface IPasswordResetToken {
    id: ObjectId;
    userId: ObjectId;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
    usedAt?: Date;
}

export interface IEmailVerificationToken {
    id: ObjectId;
    userId: ObjectId;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
    verifiedAt?: Date;
}

export interface IJwtPayload {
    sub: ObjectId;
    email: string;
    role: UserRole;
    type: TokenType;
    iat: number;
    exp: number;
    jti?: string;
}

export interface IAuthGuard {
    canActivate(context: any): boolean | Promise<boolean>;
    validateUser(payload: IJwtPayload): Promise<any>;
}

export interface IRolesGuard {
    canActivate(context: any): boolean | Promise<boolean>;
    matchRoles(roles: UserRole[], userRole: UserRole): boolean;
}

export interface IOAuthProfile {
    id: string;
    emails?: Array<{ value: string }>;
    displayName?: string;
    name?: {
        givenName?: string;
        familyName?: string;
    };
}

export interface IAuthenticatedUser {
    sub: string; // User ID (subject)
    userID: string; // Alias for sub
    email: string;
    role: UserRole;
}

export interface IAuthenticatedRequest extends Request {
    user: IAuthenticatedUser;
}
