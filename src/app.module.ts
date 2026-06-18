import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidationSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { TaskCategoriesModule } from './task-categories/task-categories.module';
import { TaskRotationsModule } from './task-rotations/task-rotations.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    DatabaseModule,
    UsersModule,
    TaskCategoriesModule,
    TasksModule,
    TaskRotationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
