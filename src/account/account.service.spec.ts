import { Test, TestingModule } from '@nestjs/testing';
import knex from 'knex';
import { Knex, KnexModule } from 'nestjs-knex';
import { IUserService, USER_SERVICE } from '../user/interfaces/user.interfaace';
import knexfile, { DEV_CONNECTION } from '../database/knexfile';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account, AccountNumberEntity } from './entities/account.entity';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ACCOUNT_SERVICE, IAccountService } from './interfaces/account.interface';
import { CreateUserResponse } from '../user/interfaces/responses/createResponse';

describe('AccountService', () => {
  let service: IAccountService;
  let db: Knex;
  let userService: IUserService;

  // Sample create account
  let createRequest: CreateUserDto = {
    email: 'john.mayor@mail.com',
    password: 'jkwjkjkw',
    phone_number: '09009987765',
    last_name: 'John',
    first_name: 'Mayor'
  }

  beforeAll(async () => {
    db = knex(knexfile['testing']);
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        KnexModule.forRoot({
          config: knexfile['testing'],
        }, DEV_CONNECTION),
      ],
      providers: [
        { provide: ACCOUNT_SERVICE, useClass: AccountService, },
        { provide: USER_SERVICE, useClass: UserService },
      ],
    })
    .overrideProvider(DEV_CONNECTION)
    .useValue(db)
    .compile();

    service = module.get<IAccountService>(ACCOUNT_SERVICE);
    userService = module.get<IUserService>(USER_SERVICE);
  });

  afterAll(async () => {
    // Delete all existing entries in tables
    await db('account').del();
    await db('user').del();

    // Reset account numbers to unused
    await db<AccountNumberEntity>('account_numbers').update('used', false);

    // Close connection
    db.destroy();
  });

  // All dependencies should be in place
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an account for a user', async ()=>{
    const spy = jest.spyOn(service, 'createAccount');
    let response = await userService.createUser(createRequest);
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual<CreateUserResponse>({
      id: expect.any(Number),
      email: createRequest.email,
      phone_number: createRequest.phone_number,
      last_name: createRequest.last_name,
      first_name: createRequest.first_name,
      account_number: expect.any(String)
    })
    
    spy.mockRestore();
  });

  it('should find an account by the user email', async ()=>{
    expect(await service.findAccountByEmail(createRequest.email))
    .toEqual<Account>({
      id: expect.any(Number),
      account_number: expect.any(String),
      balance: expect.any(Number),
      user_id: expect.any(Number),
      user_email: createRequest.email,
      user_phone_number: expect.any(String),
      account_pin: null,
      type: expect.anything(),
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    })
  })
});


