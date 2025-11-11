import { Model } from 'mongoose';
import { RefreshToken } from '../entities/refresh-token.entity';

export async function revokeAllUserRefreshTokens(
    refreshTokenModel: Model<RefreshToken>,
    userId: string
): Promise<void> {
    await refreshTokenModel.deleteMany({ userId });
}
