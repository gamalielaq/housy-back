import { SetMetadata } from "@nestjs/common";
import { UserApplicationRole } from "../enums/user-application-role.enum";

export const APPLICATION_ROLES_KEY = "application_roles";

export const ApplicationRoles = (...roles: UserApplicationRole[]) =>
  SetMetadata(APPLICATION_ROLES_KEY, roles);
