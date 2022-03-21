import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import knex, { Knex } from 'knex';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { CreateUserResponse } from '../src/user/interfaces/responses/createResponse';
import { IUserService, USER_SERVICE } from '../src/user/interfaces/user.interfaace';
import knexfile, { DEV_CONNECTION } from '../src/database/knexfile';
import { CreatePinDto } from '../src/account/dto/create-pin.dto';
import { CreatePinResponse } from '../src/account/interfaces/reponses/createPinResponse';
import { LoginResponse } from '../src/auth/interfaces/responses/LoginResponse';
import { IAccountService, ACCOUNT_SERVICE } from '../src/account/interfaces/account.interface';
import { FundDto } from '../src/payment/dto/fund.dto';
import { FundResponse } from '../src/payment/interfaces/response/FundResponse';
import { TransferDto } from '../src/payment/dto/transfer.dto';
import { Account, AccountNumberEntity } from '../src/account/entities/account.entity';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { AccountModule } from '../src/account/account.module';
import { AuthModule } from '../src/auth/auth.module';
import { PaymentModule } from '../src/payment/payment.module';
import { UserModule } from '../src/user/user.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let db: Knex;
  let jwtService: JwtService;
  let access_token: string;
  let user1: CreateUserResponse;
  let userService: IUserService;
  let accountService: IAccountService;
 

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
        KnexModule.forRoot({
          config: knexfile['testing'], // change in production
        }, DEV_CONNECTION),
        ConfigModule.forRoot({
          envFilePath: ['.dev.env'], // Change in production
          isGlobal: true
        }),
        JwtModule.register({
          secret: 'WOWSECRETLOL',
          signOptions: { expiresIn: '10h' }
        }),
        UserModule,
        AccountModule,
        AuthModule,
        PaymentModule
      ],
    })
    .overrideProvider(DEV_CONNECTION)
    .useValue(db)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userService = moduleFixture.get<IUserService>(USER_SERVICE);
    accountService = moduleFixture.get<IAccountService>(ACCOUNT_SERVICE);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Create account to use for testing
    user1 = await userService.createUser(createRequest2);

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

  // Make sure dependencies are in place
  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('/api/v1/user (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/user')
      .send(createRequest)
      .expect(201)
      .then((response)=>{
          expect(response.body).toEqual<CreateUserResponse>({
            id: expect.any(Number),
            email: createRequest.email,
            phone_number: createRequest.phone_number,
            last_name: createRequest.last_name,
            first_name: createRequest.first_name,
            account_number: expect.any(String)
          })
      })
  });

  it('/api/v1/auth/login (POST)', () => {
    let loginRequest = {
        username: createRequest2.email,
        password: createRequest2.password
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

  it('/api/v1/account/account (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/account')
      .expect(200)
      .then((response)=>{
          expect(response.body).toBeDefined()
      })
  });

  it('/api/v1/account/account/email (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/account' + '/' + user1.email)
      .expect(200)
      .then((response)=>{
          expect(response.body).toBeInstanceOf(Object);
      })
  });

  it('/api/v1/payment/fund (POST)', async () => {
    let fundRequest: FundDto = {
        amount: 1000,
        account_number: user1.account_number,
        pin: 1234
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
        account_number: user1.account_number,
        pin: 1234
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

  it('/api/v1/payment/transfer (POST)', async() => {
    let accountToCredit = await accountService.findAccountByEmail(createRequest.email);
    let transferRequest: TransferDto = {
        amount: 10,
        account_to_credit: accountToCredit.account_number,
        account_to_debit: user1.account_number,
        pin: 1234
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
