import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Knex, KnexModule } from 'nestjs-knex';
import knexfile, { DEV_CONNECTION } from '../src/database/knexfile';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import knex from 'knex';
import { IUserService, USER_SERVICE } from '../src/user/interfaces/user.interfaace';
import { Account, AccountNumberEntity } from '../src/account/entities/account.entity';
import { CreateUserResponse } from '../src/user/interfaces/responses/createResponse';
import { UserService } from '../src/user/user.service';
import { ConfigModule } from '@nestjs/config';
import { LoginResponse } from '../src/auth/interfaces/responses/LoginResponse';
import { AuthModule } from '../src/auth/auth.module';
import { AccountService } from '../src/account/account.service';
import { ACCOUNT_SERVICE } from '../src/account/interfaces/account.interface';
import { JwtModule } from '@nestjs/jwt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userService: IUserService;
  let db: Knex;
  let user1: CreateUserResponse;

 

  // Sample create account
  let createRequest: CreateUserDto = {
    email: 'femi.fred@mail.com',
    password: 'jkwjkjkw',
    phone_number: '07709987765',
    last_name: 'Femi',
    first_name: 'Fred'
  }

  beforeAll(async () => {
    db = knex(knexfile['testing']);
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot({
              envFilePath: ['.dev.env'] // Change in production
            }),
            AuthModule,
            KnexModule.forRoot({
              config: knexfile['testing'],
            }, DEV_CONNECTION),
        ],
        providers:[
            { provide: USER_SERVICE, useClass: UserService },
            { provide: ACCOUNT_SERVICE, useClass: AccountService },

        ]
    })
    .overrideProvider(DEV_CONNECTION)
    .useValue(db)
    .compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    userService = moduleFixture.get<IUserService>(USER_SERVICE);

    // Create accounts to use for testing
    user1 = await userService.createUser(createRequest);

  });

  afterAll(async () => {
       // Delete all existing entries in tables
       await db('account').del();
       await db('user').del();
       await db('intra_transaction').del();
       await db('inter_transaction').del();
       await db('transaction_history').del();
      // Reset account numbers to unused
      await db<AccountNumberEntity>('account_numbers').update('used', false);

      // Close connection
      db.destroy();
  })


  it('/api/v1/auth/login (POST)', () => {
    let loginRequest = {
        username: createRequest.email,
        password: createRequest.password
    }
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send(loginRequest)
      .expect(200)
      .then((response)=>{
          expect(response.body).toEqual<LoginResponse>({
            id: user1.id,
            email: user1.email,
            phone_number: user1.phone_number,
            last_name: user1.last_name,
            first_name: user1.first_name,
            access_token: expect.any(String)
          })
      })
  });
  
});
