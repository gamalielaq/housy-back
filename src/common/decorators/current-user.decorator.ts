import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthenticatedRequest } from "../../modules/auth/guards/jwt-auth.guard";
import { AuthJwtPayload } from "../../modules/auth/interfaces/auth-jwt-payload.interface";

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthJwtPayload => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
