import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly authService: AuthService) {
        // Initialize Passport strategy
        super({ usernameField: 'email' });
    }

    // Validate local login
    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.login({ email, password }, '', '');
        if (!user) throw new UnauthorizedException();
        return user;
    }
}
