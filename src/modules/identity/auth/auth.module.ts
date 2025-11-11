import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../users/entities/user.entity';
import { RefreshToken, RefreshTokenSchema } from './entities/refresh-token.entity';
import { Otp, OtpSchema } from './entities/otp.entity';
import { JwtStrategy } from './passport/jwt.strategy';
import { LocalStrategy } from './passport/local.strategy';
import { GoogleStrategy } from './passport/google.strategy';
import { QueueModule } from '../../messaging/queue/queue.module';
import { JWT_CONFIG } from '../../../config';
import { OtpHelper } from './helpers/otp.helper';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: RefreshToken.name, schema: RefreshTokenSchema },
            { name: Otp.name, schema: OtpSchema },
        ]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: JWT_CONFIG.accessSecret,
            signOptions: {
                expiresIn: JWT_CONFIG.accessExpiry,
                issuer: JWT_CONFIG.issuer,
                audience: JWT_CONFIG.audience,
            },
        }),
        QueueModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, LocalStrategy, GoogleStrategy, OtpHelper],
    exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
