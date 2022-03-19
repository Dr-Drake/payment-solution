import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CreateUserResponse } from './interfaces/responses/createResponse';
import { IUserService } from './interfaces/user.interfaace';
import { InjectKnex, Knex } from 'nestjs-knex';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService implements IUserService {

  // Instance variables
  private _saltRounds = 11;

  constructor(
    @InjectKnex() private readonly knex: Knex,
  ){}

  public async createUser(request: CreateUserDto): Promise<CreateUserResponse> {
    
    // Check if user exist
    const user: User = await this.knex<User>('user').where('email', '=', request.email).first();

    if (user) {
      // Log user
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    // If not, create new user and save
    const passwordHash = await bcrypt.hash(request.password, this._saltRounds);

    const newUser = new User();
    newUser.first_name = request.first_name;
    newUser.last_name = request.last_name;
    newUser.password = passwordHash;
    newUser.email = request.email;
    newUser.phone_number = request.phone_number;

    let returningOptions = [...Object.keys(User)];
    let result = await this.knex<User>('user').insert(newUser, returningOptions);

    // Return user if successful
    if (result as User[]) {
      return result[0];
    }
  }


  /**
   * No need to implement
   */
  public async findAllUsers(): Promise<User[]> {
    
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
