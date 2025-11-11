import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from '../../users/entities/user.entity';
import { AUTH_ERROR_MESSAGES } from '../../../../common/constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly authService: AuthService,
        config: ConfigService
    ) {
        const clientID = config.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET');
        const callbackURL = config.get<string>('GOOGLE_CALLBACK_URL');

        // Check if required environment variables are set
        if (!clientID || !clientSecret || !callbackURL) {
            throw new Error(AUTH_ERROR_MESSAGES.GOOGLE.CONFIG_MISSING);
        }

        // Initialize Passport strategy
        super({
            clientID,
            clientSecret,
            callbackURL,
            scope: ['email', 'profile'],
            passReqToCallback: false,
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile
    ): Promise<UserDocument> {
        // Validate OAuth login
        const user = await this.authService.oauthLogin(profile);
        return user;
    }
}
