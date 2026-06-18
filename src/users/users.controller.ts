import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<{ data: User }> {
    const user = await this.usersService.create(createUserDto);
    return { data: user };
  }

  @Get()
  async findAll(): Promise<{ data: User[] }> {
    const users = await this.usersService.findAll();
    return { data: users };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ data: User }> {
    const user = await this.usersService.findOne(id);
    return { data: user };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ data: User }> {
    const user = await this.usersService.update(id, updateUserDto);
    return { data: user };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ data: User; message: string }> {
    const user = await this.usersService.remove(id);
    return { data: user, message: 'User deactivated successfully' };
  }
}
