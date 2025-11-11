import { JWT_CONFIG } from '../../../../config/jwt.config';

export function getAccessTokenOptions() {
    return {
        secret: JWT_CONFIG.accessSecret,
        expiresIn: JWT_CONFIG.accessExpiry,
        issuer: JWT_CONFIG.issuer,
        audience: JWT_CONFIG.audience,
    };
}

export function getRefreshTokenOptions() {
    return {
        secret: JWT_CONFIG.refreshSecret,
        expiresIn: JWT_CONFIG.refreshExpiry,
        issuer: JWT_CONFIG.issuer,
        audience: JWT_CONFIG.audience,
    };
}
