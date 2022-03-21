import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Knex, KnexModule } from 'nestjs-knex';
import knexfile, { DEV_CONNECTION, TEST_CONNECTION } from '../src/database/knexfile';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import knex from 'knex';
import { IUserService, USER_SERVICE } from '../src/user/interfaces/user.interfaace';
import { Account, AccountNumberEntity } from '../src/account/entities/account.entity';
import { CreateUserResponse } from '../src/user/interfaces/responses/createResponse';
import { UserService } from '../src/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from '../src/account/account.module';
import { CreatePinDto } from '../src/account/dto/create-pin.dto';
import { CreatePinResponse } from '../src/account/interfaces/reponses/createPinResponse';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let db: Knex;
  let jwtService: JwtService;
  let access_token: string;
  let user1: CreateUserResponse;
  let userService: IUserService;
 

  // Sample create account
  let createRequest: CreateUserDto = {
    email: 'yinka.mayor@mail.com',
    password: 'jkwjkjkw',
    phone_number: '07109987765',
    last_name: 'Yinka',
    first_name: 'Mayor'
  }

  beforeAll(async () => {
    db = knex(knexfile['testing']);
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            AccountModule,
            ConfigModule.forRoot({
                envFilePath: ['.dev.env'] // Change in production
            }),
            JwtModule.register({
                secret: process.env.SECRET_KEY,
                signOptions: { expiresIn: '10h' }
            }),
            KnexModule.forRoot({
                config: knexfile['testing'],
            }, DEV_CONNECTION),
        ],
        providers:[
            { provide: USER_SERVICE, useClass: UserService },
        ]
    })
    .overrideProvider(DEV_CONNECTION)
    .useValue(db)
    .compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    userService = moduleFixture.get<IUserService>(USER_SERVICE);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Create accounts to use for testing
    user1 = await userService.createUser(createRequest);

    // Create token
    let payload = { sub: user1.id, email: user1.email };
    access_token = jwtService.sign(payload);

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


  it('/api/v1/account/pin (POST)', () => {
    let pinRequest: CreatePinDto = {
        account_number: user1.account_number,
        pin: 1234
      }
    return request(app.getHttpServer())
      .post('/api/v1/account/pin')
      .set('Authorization', `Bearer ${access_token}`)
      .send(pinRequest)
      .expect(201)
      .then((response)=>{
          expect(response.body).toEqual<CreatePinResponse>({
            account_number: user1.account_number,
            message: expect.any(String)
          })
      })
  });
  
});
