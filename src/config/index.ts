// Central configuration exports
export * from './jwt.config';
export * from './oauth.config';
export * from './paymob.config';
export * from './mail.config';
export * from './queue.config';
export { default as STORAGE_CONFIG } from './storage.config';

// Legacy exports for backward compatibility
export { JWT_CONFIG as ACCESS_JWT_SECRET, JWT_CONFIG as REFRESH_JWT_SECRET } from './jwt.config';
export { JWT_CONFIG as ACCESS_JWT_EXPIRY, JWT_CONFIG as REFRESH_JWT_EXPIRY } from './jwt.config';
export { JWT_CONFIG as JWT_ISSUER, JWT_CONFIG as JWT_AUDIENCE } from './jwt.config';
export {
    COOKIE_CONFIG as REFRESH_TOKEN_COOKIE_NAME,
    COOKIE_CONFIG as COOKIE_OPTIONS,
} from './jwt.config';
export { default as GOOGLE_OAUTH_CONFIG } from './oauth.config';
export { default as FACEBOOK_OAUTH_CONFIG } from './oauth.config';
