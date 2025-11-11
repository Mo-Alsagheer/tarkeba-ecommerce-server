import { JwtService } from '@nestjs/jwt';
import { JWT_CONFIG } from '../../../../config/jwt.config';

export function createPasswordResetToken(
    jwtService: JwtService,
    userId: string,
    email: string
): string {
    return jwtService.sign(
        { sub: userId, email },
        {
            secret: JWT_CONFIG.accessSecret,
            expiresIn: JWT_CONFIG.resetExpiry,
            issuer: JWT_CONFIG.issuer,
            audience: JWT_CONFIG.audience,
        }
    );
}
