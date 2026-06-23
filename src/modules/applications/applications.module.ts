import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { PasswordHashingService } from "../auth/password-hashing.service";
import { ApplicationsController } from "./applications.controller";
import { ApplicationsService } from "./applications.service";
import { Application } from "./entities/application.entity";
import { UserApplication } from "./entities/user-application.entity";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Application, UserApplication]),
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, PasswordHashingService],
  exports: [TypeOrmModule, ApplicationsService],
})
export class ApplicationsModule {}
