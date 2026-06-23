import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { RefreshToken } from "./entities/refresh-token.entity";
import { Session } from "./entities/session.entity";
import { SessionsController } from "./sessions.controller";
import { SessionsService } from "./sessions.service";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([RefreshToken, Session])],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [TypeOrmModule, SessionsService],
})
export class SessionsModule {}
