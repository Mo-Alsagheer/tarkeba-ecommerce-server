// Auth error messages and configuration constants
export const AUTH_ERROR_MESSAGES = {
    JWT: {
        CONFIG_MISSING:
            'JWT configuration is missing. Please check ACCESS_JWT_SECRET, JWT_ISSUER, and JWT_AUDIENCE environment variables.',
    },
    GOOGLE: {
        CONFIG_MISSING:
            'Google OAuth configuration is missing. Please check GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL environment variables.',
    },
} as const;

// Auth validation messages
export const AUTH_VALIDATION_MESSAGES = {
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please provide a valid email address',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long',
    PASSWORD_COMPLEXITY:
        'Password must contain uppercase, lowercase, number, and special character',
    USERNAME_REQUIRED: 'Username is required',
    USERNAME_MIN_LENGTH: 'Username must be at least 2 characters long',
    USERNAME_MAX_LENGTH: 'Username must be at most 50 characters long',
    CONFIRM_PASSWORD_REQUIRED: 'Password confirmation is required',
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
    NEW_PASSWORD_REQUIRED: 'New password is required',
    RESET_TOKEN_REQUIRED: 'Reset token is required',
    VERIFY_TOKEN_REQUIRED: 'Verification token is required',
    REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
} as const;

// Auth field formats and constraints
export const AUTH_FIELD_CONSTRAINTS = {
    USERNAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 50,
    },
    PASSWORD: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 128,
        PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    },
    EMAIL: {
        FORMAT: 'email',
    },
} as const;
