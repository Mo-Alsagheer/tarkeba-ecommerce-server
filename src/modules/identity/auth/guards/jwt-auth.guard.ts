import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../users/entities/user.entity';

interface JwtPayloadUser {
    userID: string;
    email: string;
    roles: string[];
}

interface RequestWithUser extends Request {
    user: JwtPayloadUser;
}

@ApiBearerAuth()
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // First, validate the JWT token
        const isAuthenticated = await super.canActivate(context);
        if (!isAuthenticated) {
            return false;
        }

        // Get the request object
        const request = context.switchToHttp().getRequest<RequestWithUser>();
        const user = request.user;

        // Check if user exists and is verified
        const dbUser = await this.userModel.findById(user.userID);
        if (!dbUser) {
            throw new UnauthorizedException('User not found');
        }

        if (!dbUser.isVerified) {
            throw new UnauthorizedException(
                'Email not verified. Please verify your email to access this resource.'
            );
        }

        return true;
    }
}
