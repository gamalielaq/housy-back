import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApplicationRoles } from "../../common/decorators/application-roles.decorator";
import { UserApplicationRole } from "../../common/enums/user-application-role.enum";
import { ApplicationRolesGuard } from "../../common/guards/application-roles.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { SessionsService } from "./sessions.service";

@Controller("sessions")
@UseGuards(JwtAuthGuard, ApplicationRolesGuard)
@ApplicationRoles(UserApplicationRole.OWNER, UserApplicationRole.ADMIN)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  async findActive() {
    const data = await this.sessionsService.findActive();
    return { data };
  }

  @Post(":id/revoke")
  async revoke(@Param("id", ParseUUIDPipe) id: string) {
    const data = await this.sessionsService.revoke(id);
    return { data, message: "Session revoked successfully" };
  }
}
