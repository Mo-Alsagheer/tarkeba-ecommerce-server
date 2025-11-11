import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // get required roles from metadata
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // if no roles are required, allow access
        if (!requiredRoles) {
            return true;
        }

        // get user from request
        const request = context.switchToHttp().getRequest<{ user?: User }>();
        const user = request.user;

        // if user is not found, deny access
        if (!user) {
            return false;
        }

        // check if user has required role
        return requiredRoles.some((role) => user?.roles?.includes(role));
    }
}
