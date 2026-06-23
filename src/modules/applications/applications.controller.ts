import {
  Body,
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
import { ApplicationsService } from "./applications.service";
import { CreateApplicationDto } from "./dto/create-application.dto";

@Controller("applications")
@UseGuards(JwtAuthGuard, ApplicationRolesGuard)
@ApplicationRoles(UserApplicationRole.OWNER)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  async create(@Body() createApplicationDto: CreateApplicationDto) {
    const data = await this.applicationsService.create(createApplicationDto);
    return { data };
  }

  @Get()
  async findAll() {
    const data = await this.applicationsService.findAll();
    return { data };
  }

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const data = await this.applicationsService.findOne(id);
    return { data };
  }
}
