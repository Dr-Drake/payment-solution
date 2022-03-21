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
import { PaymentModule } from '../src/payment/payment.module';
import { ACCOUNT_SERVICE, IAccountService } from '../src/account/interfaces/account.interface';
import { UserService } from '../src/user/user.service';
import { AccountService } from '../src/account/account.service';
import { FundDto } from '../src/payment/dto/fund.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { FundResponse } from '../src/payment/interfaces/response/FundResponse';
import { TransferDto } from '../src/payment/dto/transfer.dto';

describe('PaymentController (e2e)', () => {
  let app: INestApplication;
  let db: Knex;
  let jwtService: JwtService;
  let access_token: string;

  let userService: IUserService;
  let accountService: IAccountService;
  let account1: Account;
  let account2: Account;

  // Sample create account
  let createRequest: CreateUserDto = {
    email: 'yinka.mayor@mail.com',
    password: 'jkwjkjkw',
    phone_number: '07109987765',
    last_name: 'Yinka',
    first_name: 'Mayor'
  }
  let createRequest2: CreateUserDto = {
    email: 'paul.fab@mail.com',
    password: 'jkwjkjkw',
    phone_number: '09309912365',
    last_name: 'Paul',
    first_name: 'Fab'
  }

  beforeAll(async () => {
    db = knex(knexfile['testing']);
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            PaymentModule,
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
            { provide: ACCOUNT_SERVICE, useClass: AccountService }
        ]
    })
    .overrideProvider(DEV_CONNECTION)
    .useValue(db)
    .compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    userService = moduleFixture.get<IUserService>(USER_SERVICE);
    accountService = moduleFixture.get<IAccountService>(ACCOUNT_SERVICE);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Create accounts to use for testing
    let user1 = await userService.createUser(createRequest);
    let user2 = await userService.createUser(createRequest2);

    // Create token
    let payload = { sub: user1.id, email: user1.email };
    access_token = jwtService.sign(payload);

    account1 = await accountService.findAccountByEmail(createRequest.email);
    account2 = await accountService.findAccountByEmail(createRequest2.email);
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


  it('/api/v1/payment/fund (POST)', () => {
    let fundRequest: FundDto = {
        amount: 1000,
        account_number: account1.account_number
    }
    return request(app.getHttpServer())
      .post('/api/v1/payment/fund')
      .set('Authorization', `Bearer ${access_token}`)
      .send(fundRequest)
      .expect(200)
      .then((response)=>{
          expect(response.body).toEqual<FundResponse>({
            message: expect.any(String),
            amount: fundRequest.amount,
            prevBalance: 0.00,
            balance: fundRequest.amount,
            transaction_ref: expect.any(String)
          })
      })
  });

  it('/api/v1/payment/withdraw (POST)', () => {
    let fundRequest: FundDto = {
        amount: 10,
        account_number: account1.account_number
    }
    return request(app.getHttpServer())
      .post('/api/v1/payment/withdraw')
      .set('Authorization', `Bearer ${access_token}`)
      .send(fundRequest)
      .expect(200)
      .then((response)=>{
          expect(response.body).toEqual<FundResponse>({
            message: expect.any(String),
            amount: fundRequest.amount,
            prevBalance: 1000,
            balance: 1000 - fundRequest.amount,
            transaction_ref: expect.any(String)
          })
      })
  });

  it('/api/v1/payment/transfer (POST)', () => {
    let transferRequest: TransferDto = {
        amount: 10,
        account_to_credit: account2.account_number,
        account_to_debit: account1.account_number,
      }
    return request(app.getHttpServer())
      .post('/api/v1/payment/transfer')
      .set('Authorization', `Bearer ${access_token}`)
      .send(transferRequest)
      .expect(200)
      .then((response)=>{
          expect(response.body).toEqual<FundResponse>({
            message: expect.any(String),
            amount: transferRequest.amount,
            prevBalance: 990,
            balance: 990 - transferRequest.amount,
            transaction_ref: expect.any(String)
          })
      })
  });

  
});
