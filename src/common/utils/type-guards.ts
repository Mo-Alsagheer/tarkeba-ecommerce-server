import { IOAuthProfile } from '../interfaces';

// Type guard for object with refreshToken
export function hasRefreshToken(obj: unknown): obj is { refreshToken: string } {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'refreshToken' in obj &&
        typeof (obj as Record<string, unknown>).refreshToken === 'string'
    );
}

export function isOAuthProfileLike(value: unknown): value is IOAuthProfile {
    if (typeof value !== 'object' || value === null) return false;
    const v = value as Record<string, unknown>;
    if (!('id' in v) || typeof v.id !== 'string') return false;
    if ('emails' in v && v.emails !== undefined) {
        const emails = v.emails as unknown;
        if (!Array.isArray(emails)) return false;
        if (emails.length > 0) {
            const first = emails[0] as Record<string, unknown> | undefined;
            if (!first || typeof first.value !== 'string') return false;
        }
    }
    return true;
}
