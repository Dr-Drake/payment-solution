import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserService, USER_SERVICE } from './interfaces/user.interfaace';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('/api/v1/user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAllUsers();
  }

  @Get(':email')
  findUserByEmail(@Param('email') email: string) {
    return this.userService.findUserByEmail(email);
  }

  @Get(':phone_number')
  findUserByPhoneNumber(@Param('phone_number') phone_number: string) {
    return this.userService.findUserByPhoneNumber(phone_number);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
