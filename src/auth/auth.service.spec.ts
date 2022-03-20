import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import knex from 'knex';
import { Knex, KnexModule } from 'nestjs-knex';
import knexfile, { DEV_CONNECTION } from '../database/knexfile';
import { AuthService } from './auth.service';
import { IUserService, USER_SERVICE } from '../user/interfaces/user.interfaace';
import { UserService } from '../user/user.service';
import { AccountNumberEntity } from '../account/entities/account.entity';
import { ACCOUNT_SERVICE,  } from '../account/interfaces/account.interface';
import { AccountService } from '../account/account.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { LoginResponse } from './interfaces/responses/LoginResponse';
import { AUTH_SERVICE, IAuthService } from './interfaces/auth.interface';

describe('AuthService', () => {
  let service: IAuthService;
  let userService: IUserService;
  let db: Knex;

  // Sample create user
  let createRequest: CreateUserDto = {
    email: 'jack.chan@mail.com',
    password: 'jkwjkjkw',
    phone_number: '09009987764',
    last_name: 'Jackie',
    first_name: 'Chan'
  }

  beforeAll(async () => {
    db = knex(knexfile['testing']);
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        KnexModule.forRoot({
          config: knexfile['testing'],
        }, DEV_CONNECTION),
        JwtModule.register({
          secret: 'WOWSECRETLOL',
          signOptions: { expiresIn: '10h' }
        })
      ],
      providers: [
        { provide: USER_SERVICE, useClass: UserService },
        { provide: ACCOUNT_SERVICE, useClass: AccountService },
        { provide: AUTH_SERVICE, useClass: AuthService }  
      ],
    })
    .overrideProvider(DEV_CONNECTION)
    .useValue(db)
    .compile();

    service = module.get<IAuthService>(AUTH_SERVICE);
    userService = module.get<IUserService>(USER_SERVICE);

    // Create our sample user in the test database
    await userService.createUser(createRequest);
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

  it('should validate user login', async ()=>{
    expect(await service.validateUser(createRequest.email, createRequest.password))
    .toEqual<User>({
      id: expect.any(Number),
      password: expect.any(String),
      email: createRequest.email,
      phone_number: createRequest.phone_number,
      last_name: createRequest.last_name,
      first_name: createRequest.first_name,
      created_at: expect.any(Date),
      updated_at: expect.any(Date)
    })
  });

  it('should login user, and return JWT', async ()=>{
    let user = await service.validateUser(createRequest.email, createRequest.password);
    expect(await service.login(user))
    .toEqual<LoginResponse>({
      ...user,
      access_token: expect.any(String)
    })
  })
});
