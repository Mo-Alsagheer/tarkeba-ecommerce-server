// IMPORTANT: Load environment variables FIRST before any other imports
import { config } from 'dotenv';
config();
// console.log('[ENV] ACCESS_JWT_SECRET:', process.env.ACCESS_JWT_SECRET ? 'SET' : 'NOT SET');
// console.log('[ENV] REFRESH_JWT_SECRET:', process.env.REFRESH_JWT_SECRET ? 'SET' : 'NOT SET');

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MessagingModule } from './modules/messaging/messaging.module';
import { IdentityModule } from './modules/identity/identity.module';
import { CommerceModule } from './modules/commerce/commerce.module';
import { AdminModule } from './modules/admin/admin.module';
import { SanitizeMiddleware } from './common/middleware/sanitize.middleware';

// Import all configuration modules
import appConfig from './config/app/configuration';
import databaseConfig from './config/database/configuration';
import storageConfig from './config/storage.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, databaseConfig, storageConfig],
        }),
        // Rate limiting to prevent DoS attacks
        ThrottlerModule.forRoot([
            {
                name: 'short',
                ttl: 1000, // 1 second
                limit: 10, // 10 requests per second
            },
            {
                name: 'medium',
                ttl: 60000, // 1 minute
                limit: 100, // 100 requests per minute
            },
            {
                name: 'long',
                ttl: 900000, // 15 minutes
                limit: 500, // 500 requests per 15 minutes
            },
        ]),
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('database.uri'),
            }),
        }),
        // Core modules
        MessagingModule, // Queue + Mail
        IdentityModule, // Auth + Users
        CommerceModule, // Catalog + Sales + Returns
        AdminModule, // Admin dashboard
    ],
    providers: [
        // Apply rate limiting globally
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // Apply sanitize middleware to all routes
        consumer.apply(SanitizeMiddleware).forRoutes('*path');
    }
}
