import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { APPLICATION_ROLES_KEY } from "../decorators/application-roles.decorator";
import { UserApplicationRole } from "../enums/user-application-role.enum";
import { AuthenticatedRequest } from "../../modules/auth/guards/jwt-auth.guard";

@Injectable()
export class ApplicationRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      UserApplicationRole[]
    >(APPLICATION_ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userRole = request.user?.role as UserApplicationRole | undefined;

    if (userRole && requiredRoles.includes(userRole)) {
      return true;
    }

    throw new ForbiddenException("Insufficient application role");
  }
}
