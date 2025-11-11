import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

/**
 * IdentityModule - Aggregates authentication and user management
 *
 * This module groups all identity-related functionality:
 * - Authentication (login, register, OAuth)
 * - User management (profiles, roles)
 */
@Module({
    imports: [AuthModule, UsersModule],
    exports: [AuthModule, UsersModule],
})
export class IdentityModule {}
