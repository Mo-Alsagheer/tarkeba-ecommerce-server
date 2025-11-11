export enum TokenType {
    ACCESS = 'access',
    REFRESH = 'refresh',
    RESET_PASSWORD = 'reset_password',
    EMAIL_VERIFICATION = 'email_verification',
}

export enum SessionStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    REVOKED = 'revoked',
    COMPROMISED = 'compromised',
}

export enum LoginAttemptStatus {
    SUCCESS = 'success',
    FAILED = 'failed',
    BLOCKED = 'blocked',
}

export enum TwoFactorMethod {
    SMS = 'sms',
    EMAIL = 'email',
    TOTP = 'totp',
    BACKUP_CODES = 'backup_codes',
}

export enum OtpType {
    EMAIL_VERIFICATION = 'email_verification',
    PASSWORD_RESET = 'password_reset',
}
