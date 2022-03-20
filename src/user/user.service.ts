import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { CreateUserResponse } from './interfaces/responses/createResponse';
import { IUserService } from './interfaces/user.interfaace';
import { InjectKnex, Knex } from 'nestjs-knex';
import { hash } from 'bcrypt';
import { DEV_CONNECTION } from '../database/knexfile';
import { CreateAccountDto } from '../account/dto/create-account.dto';
import AccountType from '../account/enums/AccountTypes';
import { ACCOUNT_SERVICE, IAccountService } from '../account/interfaces/account.interface';
import { Account } from '../account/entities/account.entity';
import { FetchUserResponse } from './interfaces/responses/fetchUserResponse';

@Injectable()
export class UserService implements IUserService {

  // Instance variables
  private _saltRounds = 11;

  constructor(
    @InjectKnex(DEV_CONNECTION) private readonly knex: Knex,
    @Inject(ACCOUNT_SERVICE) private readonly accountService: IAccountService,
  ){}

  public async createUser(request: CreateUserDto): Promise<CreateUserResponse> {
    
    // Check if user exist
    const user: User = await this.knex<User>('user').where('email', '=', request.email).first();

    if (user) {

      // Check if user has an account
      let account: Account = await this.accountService.findAccountByEmail(user.email);

      if (account) {
        throw new BadRequestException('User already exists');
      }
      
      // If account not created, create it
      let accountCreateRequest: CreateAccountDto = {
        user_id: user.id,
        user_email: user.email,
        user_phone_number: user.phone_number,
        type: AccountType.CURRENT
      }
      let accountCreateResult = await this.accountService.createAccount(accountCreateRequest);
      let response: CreateUserResponse = {
        id: user.id,
        email: user.email,
        phone_number: user.phone_number,
        last_name: user.last_name,
        first_name: user.first_name,
        account_number: accountCreateResult.account_number
      }
      return response
    
    }

    // If not, create new user and save
    const passwordHash = await hash(request.password, this._saltRounds);

    const newUser = new User();
    newUser.first_name = request.first_name;
    newUser.last_name = request.last_name;
    newUser.password = passwordHash;
    newUser.email = request.email;
    newUser.phone_number = request.phone_number;

    let returningOptions = ['id'];
    let result = await this.knex<User>('user').insert(newUser, returningOptions);

    // if successful create a current account for the user
    if (result && result.length > 0) {

      let accountCreateRequest: CreateAccountDto = {
        user_id: result[0],
        user_email: newUser.email,
        user_phone_number: newUser.phone_number,
        type: AccountType.CURRENT
      }

      // Create account
      let accountCreateResult = await this.accountService.createAccount(accountCreateRequest);
      let response: CreateUserResponse = {
        id: result[0],
        email: newUser.email,
        phone_number: newUser.phone_number,
        last_name: newUser.last_name,
        first_name: newUser.first_name,
        account_number: accountCreateResult.account_number
      }
      return response;
    }
  }

  public async findUserByEmail(email: string): Promise<FetchUserResponse> {
    let user: User = await this.knex<User>('user').where('email', '=', email).first()

    if (user) {
      let response: FetchUserResponse = {
        id: user.id,
        email: user.email,
        phone_number: user.phone_number,
        last_name: user.last_name,
        first_name: user.first_name,
      }
      return response;
    }

    // otherwise not found
    throw new NotFoundException('User not found');
    
  }


  /**
   * No need to implement the rest
   */
  public async findAllUsers(): Promise<FetchUserResponse[]> {
    
    throw new Error('Method not implemented.');
  }
  
  findUserById(id: number): Promise<FetchUserResponse> {
    throw new Error('Method not implemented.');
  }
  findUserByPhoneNumber(phone_number: string): Promise<FetchUserResponse> {
    throw new Error('Method not implemented.');
  }
  
}
