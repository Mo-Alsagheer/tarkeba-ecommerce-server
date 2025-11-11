import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { UserDocument } from '../../users/entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { genJti, hashJti, JwtPayload } from '../../../../common/helpers/jti';
import { getAccessTokenOptions, getRefreshTokenOptions } from './jwt.helpers';

import { JWT_CONFIG } from '../../../../config/jwt.config';

export async function issueTokensHelper(
    jwtService: JwtService,
    refreshTokenModel: Model<RefreshToken>,
    user: UserDocument,
    ip: string,
    device: string
) {
    const jti = genJti();
    const userID =
        user._id instanceof Types.ObjectId ? user._id.toString() : user._id?.toString() || '';
    const payload: JwtPayload = {
        sub: userID,
        email: user.email,
        roles: user.roles,
        jti,
    };

    const accessToken = jwtService.sign(payload, getAccessTokenOptions());
    const refreshToken = jwtService.sign(payload, getRefreshTokenOptions());

    // calculate refresh token ttl (time to live)
    const refreshTokenTtl = Number(JWT_CONFIG.refreshExpiry) || 1000 * 60 * 60 * 24 * 30;

    // calculate refresh token expiry
    const expiresAt = new Date(Date.now() + refreshTokenTtl);

    // create refresh token
    await refreshTokenModel.create({
        jtiHash: hashJti(jti),
        userId: userID,
        expiresAt,
        ip,
        device,
    });

    return { accessToken, refreshToken, refreshTokenTtl };
}
