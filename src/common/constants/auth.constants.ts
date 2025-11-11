// Auth-related constants
export const AUTH_CONSTANTS = {
    JWT: {
        ACCESS_TOKEN_EXPIRES_IN: '15m',
        REFRESH_TOKEN_EXPIRES_IN: '7d',
        RESET_TOKEN_EXPIRES_IN: '1h',
        VERIFICATION_TOKEN_EXPIRES_IN: '24h',
        ISSUER: 'tarkeba-ecommerce',
        AUDIENCE: 'tarkeba-users',
    },
    PASSWORD: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 128,
        REQUIRE_UPPERCASE: true,
        REQUIRE_LOWERCASE: true,
        REQUIRE_NUMBERS: true,
        REQUIRE_SYMBOLS: true,
        BCRYPT_ROUNDS: 12,
    },
    RATE_LIMITING: {
        LOGIN_ATTEMPTS: {
            MAX_ATTEMPTS: 5,
            WINDOW_MS: 15 * 60 * 1000, // 15 minutes
            BLOCK_DURATION: 60 * 60 * 1000, // 1 hour
        },
        REGISTRATION: {
            MAX_ATTEMPTS: 3,
            WINDOW_MS: 60 * 60 * 1000, // 1 hour
        },
        PASSWORD_RESET: {
            MAX_ATTEMPTS: 3,
            WINDOW_MS: 60 * 60 * 1000, // 1 hour
        },
    },
    SESSION: {
        MAX_CONCURRENT_SESSIONS: 5,
        INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    },
};

export const AUTH_MESSAGES = {
    SUCCESS: {
        REGISTRATION_SUCCESS: 'Registration successful',
        LOGIN_SUCCESS: 'Login successful',
        LOGOUT_SUCCESS: 'Logout successful',
        TOKEN_REFRESHED: 'Token refreshed successfully',
        PASSWORD_RESET_SENT: 'Password reset email sent',
        PASSWORD_RESET_SUCCESS: 'Password reset successful',
        EMAIL_VERIFIED: 'Email verified successfully',
    },
    ERROR: {
        INVALID_CREDENTIALS: 'Invalid email or password',
        USER_NOT_FOUND: 'User not found',
        EMAIL_ALREADY_EXISTS: 'Email already exists',
        INVALID_TOKEN: 'Invalid or expired token',
        TOKEN_EXPIRED: 'Token has expired',
        TOKEN_REUSE_DETECTED: 'Token reuse detected - all sessions revoked',
        ACCOUNT_LOCKED: 'Account temporarily locked due to multiple failed attempts',
        EMAIL_NOT_VERIFIED: 'Email address not verified',
        WEAK_PASSWORD: 'Password does not meet security requirements',
        INVALID_REFRESH_TOKEN: 'Invalid refresh token',
        SESSION_EXPIRED: 'Session has expired',
        UNAUTHORIZED: 'Unauthorized access',
        FORBIDDEN: 'Access forbidden',
        OAUTH_ERROR: 'OAuth authentication failed',
    },
    VALIDATION: {
        EMAIL_REQUIRED: 'Email is required',
        EMAIL_INVALID: 'Invalid email format',
        PASSWORD_REQUIRED: 'Password is required',
        PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
        PASSWORD_TOO_LONG: 'Password must not exceed 128 characters',
        PASSWORD_WEAK: 'Password must contain uppercase, lowercase, numbers, and symbols',
        FIRST_NAME_REQUIRED: 'First name is required',
        LAST_NAME_REQUIRED: 'Last name is required',
        TERMS_REQUIRED: 'You must accept the terms and conditions',
    },
};

export const AUTH_OPERATIONS = {
    REGISTER: 'Register new user account',
    LOGIN: 'Login with email and password',
    REFRESH_TOKEN: 'Refresh access token',
    LOGOUT: 'Logout and revoke tokens',
    FORGOT_PASSWORD: 'Request password reset',
    RESET_PASSWORD: 'Reset password with token',
    VERIFY_EMAIL: 'Verify email address',
    RESEND_VERIFICATION: 'Resend verification email',
    CHANGE_PASSWORD: 'Change user password',
    REVOKE_ALL_SESSIONS: 'Revoke all user sessions',
    OAUTH_GOOGLE: 'Login with Google',
    GET_PROFILE: 'Get user profile',
    UPDATE_PROFILE: 'Update user profile',
};
