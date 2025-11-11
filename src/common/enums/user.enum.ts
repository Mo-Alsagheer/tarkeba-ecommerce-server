export enum UserRole {
    CUSTOMER = 'customer',
    ADMIN = 'admin',
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    PENDING_VERIFICATION = 'pending_verification',
}

export enum AuthProvider {
    LOCAL = 'local',
    GOOGLE = 'google',
    FACEBOOK = 'facebook',
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
    PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}
