import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this._reflector.get(
      'META_ROLES',
      context.getHandler(),
    );

    if (!validRoles) return true;

    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();

    const user = req.user;

    if (!user) throw new BadRequestException('User not found');

    if (!validRoles.includes(user.role)) {
      throw new BadRequestException(
        `User ${user.fullName} needs a valid role: [${validRoles}]`,
      );
    }

    return true;
  }
}
