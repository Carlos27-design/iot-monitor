import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../interface';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guard/user-role/user-role.guard';
import { RolesProtected } from './roles.decorators';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RolesProtected(...roles),
    UseGuards(AuthGuard('jwt'), UserRoleGuard),
  );
}
