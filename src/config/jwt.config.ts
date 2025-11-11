import type { JwtSignOptions } from '@nestjs/jwt';

// JWT Configuration
export const JWT_CONFIG = {
    accessSecret: process.env.ACCESS_JWT_SECRET as string,
    refreshSecret: process.env.REFRESH_JWT_SECRET as string,
    accessExpiry: process.env.ACCESS_JWT_EXPIRY as JwtSignOptions['expiresIn'],
    refreshExpiry: process.env.REFRESH_JWT_EXPIRY as JwtSignOptions['expiresIn'],
    resetExpiry: process.env.RESET_JWT_EXPIRY as JwtSignOptions['expiresIn'],
    issuer: process.env.JWT_ISSUER as string,
    audience: process.env.JWT_AUDIENCE as string,
};

// Helper functions for JWT options
export function getAccessTokenOptions() {
    return {
        secret: JWT_CONFIG.accessSecret,
        signOptions: {
            expiresIn: JWT_CONFIG.accessExpiry,
            issuer: JWT_CONFIG.issuer,
            audience: JWT_CONFIG.audience,
        },
    };
}

export function getRefreshTokenOptions() {
    return {
        secret: JWT_CONFIG.refreshSecret,
        signOptions: {
            expiresIn: JWT_CONFIG.refreshExpiry,
            issuer: JWT_CONFIG.issuer,
            audience: JWT_CONFIG.audience,
        },
    };
}

// Cookie Configuration
export const COOKIE_CONFIG = {
    refreshTokenName: 'refreshToken',
    options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    },
};
