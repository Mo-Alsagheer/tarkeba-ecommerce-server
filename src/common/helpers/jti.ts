import { randomBytes, createHash } from 'crypto';

export interface JwtPayload {
    sub: string; // userId
    email: string;
    roles: string[];
    jti: string;
    iat?: number;
    exp?: number;
}

export function genJti(): string {
    return randomBytes(16).toString('hex');
}

export function hashJti(jti: string): string {
    return createHash('sha256').update(jti).digest('hex');
}
