import { UserRole, UserStatus, AuthProvider, Gender } from '../enums';
import { ObjectId } from './common.types';

export type UserProfile = {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    gender?: Gender;
    phone?: string;
    avatar?: string;
    bio?: string;
};

export type UserAddress = {
    id?: string;
    type: 'home' | 'work' | 'other';
    firstName: string;
    lastName: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
    isDefault: boolean;
};

export type UserPreferences = {
    language: string;
    currency: string;
    timezone: string;
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
        marketing: boolean;
    };
    privacy: {
        profileVisibility: 'public' | 'private';
        showOnlineStatus: boolean;
    };
};

export type OAuthProfile = {
    googleId?: string;
    facebookId?: string;
    provider: AuthProvider;
    providerId: string;
    email: string;
    name: string;
    avatar?: string;
};

export type UserSummary = {
    id: ObjectId;
    email: string;
    name: string;
    role: UserRole;
    status: UserStatus;
    avatar?: string;
};

export type UserStats = {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: Date;
    joinedDate: Date;
};
