// IMPORTANT: Load environment variables FIRST before any other imports
import { config } from 'dotenv';
config();
// console.log('[ENV] ACCESS_JWT_SECRET:', process.env.ACCESS_JWT_SECRET ? 'SET' : 'NOT SET');
// console.log('[ENV] REFRESH_JWT_SECRET:', process.env.REFRESH_JWT_SECRET ? 'SET' : 'NOT SET');

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagingModule } from './modules/messaging/messaging.module';
import { IdentityModule } from './modules/identity/identity.module';
import { CommerceModule } from './modules/commerce/commerce.module';
import { AdminModule } from './modules/admin/admin.module';

// Import all configuration modules
import appConfig from './config/app/configuration';
import databaseConfig from './config/database/configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, databaseConfig],
        }),
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
})
export class AppModule {}
