import { UserRole, UserStatus } from '../enums';
import { ObjectId, PaginatedResponse, PaginationQuery } from '../types';

export interface IUser {
    id: ObjectId;
    email: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    profile: {
        firstName: string;
        lastName: string;
        phone?: string;
        avatar?: string;
        dateOfBirth?: Date;
    };
    oauth?: {
        googleId?: string;
        facebookId?: string;
    };
    preferences: {
        language: string;
        currency: string;
        notifications: {
            email: boolean;
            sms: boolean;
            marketing: boolean;
        };
    };
    lastLoginAt?: Date;
    emailVerifiedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserService {
    create(userData: Partial<IUser>): Promise<IUser>;
    findById(id: string): Promise<IUser | null>;
    findByEmail(email: string): Promise<IUser | null>;
    update(id: string, updateData: Partial<IUser>): Promise<IUser>;
    delete(id: string): Promise<void>;
    findAll(query: PaginationQuery): Promise<PaginatedResponse<IUser>>;
    changePassword(id: string, oldPassword: string, newPassword: string): Promise<void>;
    verifyEmail(id: string): Promise<void>;
    updateLastLogin(id: string): Promise<void>;
}

export interface IUserRepository {
    create(userData: Partial<IUser>): Promise<IUser>;
    findById(id: string): Promise<IUser | null>;
    findByEmail(email: string): Promise<IUser | null>;
    update(id: string, updateData: Partial<IUser>): Promise<IUser>;
    delete(id: string): Promise<boolean>;
    findMany(query: any, options?: any): Promise<IUser[]>;
    count(query?: any): Promise<number>;
}
