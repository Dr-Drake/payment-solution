import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CreateUserResponse } from './interfaces/responses/createResponse';
import { IUserService } from './interfaces/user.interfaace';

@Injectable()
export class UserService implements IUserService {
  createUser(request: CreateUserDto): Promise<CreateUserResponse> {
    throw new Error('Method not implemented.');
  }
  findAllUsers(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  findUserById(id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findUserByEmail(email: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findUserByPhoneNumber(phone_number: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  
}
