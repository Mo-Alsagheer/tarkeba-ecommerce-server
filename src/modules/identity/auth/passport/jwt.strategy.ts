import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../../../common/helpers/jti';
import { AUTH_ERROR_MESSAGES } from '../../../../common/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
        const ignoreExpiration = false;
        const secretOrKey = config.get<string>('ACCESS_JWT_SECRET');
        const issuer = config.get<string>('JWT_ISSUER');
        const audience = config.get<string>('JWT_AUDIENCE');

        // Check if required environment variables are set
        if (!secretOrKey || !issuer || !audience) {
            console.error('[JwtStrategy] JWT Configuration Error:', {
                ACCESS_JWT_SECRET: secretOrKey ? '****' + secretOrKey.substr(-4) : 'MISSING',
                JWT_ISSUER: issuer || 'MISSING',
                JWT_AUDIENCE: audience || 'MISSING',
                ENV_ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET
                    ? 'Present in process.env'
                    : 'Missing in process.env',
            });
            throw new Error(AUTH_ERROR_MESSAGES.JWT.CONFIG_MISSING);
        }

        // Initialize Passport strategy
        super({
            jwtFromRequest,
            ignoreExpiration,
            secretOrKey,
            issuer,
            audience,
        });
    }

    validate(payload: JwtPayload) {
        // Attach user claims to request
        return {
            userID: payload.sub,
            email: payload.email,
            roles: payload.roles,
        };
    }
}
