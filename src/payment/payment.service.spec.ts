import { Test, TestingModule } from '@nestjs/testing';
import knex from 'knex';
import { Knex, KnexModule } from 'nestjs-knex';
import { CreateUserDto } from '../user/dto/create-user.dto';
import knexfile, { DEV_CONNECTION } from '../database/knexfile';
import { PaymentService } from './payment.service';
import { UserService } from '../user/user.service';
import { AccountService } from '../account/account.service';
import { Account, AccountNumberEntity } from '../account/entities/account.entity';
import { ACCOUNT_SERVICE, IAccountService } from '../account/interfaces/account.interface';
import { IUserService, USER_SERVICE } from '../user/interfaces/user.interfaace';
import { FundDto } from './dto/fund.dto';
import { FundResponse } from './interfaces/response/FundResponse';
import { TransferDto } from './dto/transfer.dto';
import { CreateUserResponse } from '../user/interfaces/responses/createResponse';
import { CreatePinDto } from '../account/dto/create-pin.dto';

describe('PaymentService', () => {
  let service: PaymentService;
  let userService: IUserService;
  let accountService: IAccountService;
  let account1: Account;
  let account2: Account;

  let user1: CreateUserResponse;
  let user2: CreateUserResponse;
  let db: Knex;

  // Sample create account
  let createRequest: CreateUserDto = {
    email: 'mick.mayor@mail.com',
    password: 'jkwjkjkw',
    phone_number: '01109987765',
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
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        KnexModule.forRoot({
          config: knexfile['testing'],
        }, DEV_CONNECTION),
      ],
      providers: [
        PaymentService,
        { provide: ACCOUNT_SERVICE, useClass: AccountService },
        { provide: USER_SERVICE, useClass: UserService }
      ],
    })
    .overrideProvider(DEV_CONNECTION)
    .useValue(db)
    .compile();

    service = module.get<PaymentService>(PaymentService);
    userService = module.get<IUserService>(USER_SERVICE);
    accountService = module.get<IAccountService>(ACCOUNT_SERVICE);

    // Create accounts to use for testing
    user1 = await userService.createUser(createRequest);
    user2 = await userService.createUser(createRequest2);

    let pinRequest1: CreatePinDto = {
      account_number: user1.account_number,
      pin: 1234
    }
    let pinRequest2: CreatePinDto = {
      account_number: user2.account_number,
      pin: 1234
    }

    await accountService.createAccountPin(pinRequest1, createRequest.email)
    await accountService.createAccountPin(pinRequest2, createRequest2.email)

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

  // All dependencies are in place
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fund an account',async () => {
    let fundRequest: FundDto = {
      amount: 1000,
      account_number: account1.account_number,
      pin: 1234
    }
    expect(await service.fundAccount(fundRequest, account1.user_email))
    .toEqual<FundResponse>({
      message: expect.any(String),
      amount: fundRequest.amount,
      prevBalance: 0.00,
      balance: fundRequest.amount,
      transaction_ref: expect.any(String)
    })
  });

  it('should withdraw from an account',async () => {
    let fundRequest: FundDto = {
      amount: 10,
      account_number: account1.account_number,
      pin: 1234
    }
    expect(await service.withdrawFromAccount(fundRequest, account1.user_email))
    .toEqual<FundResponse>({
      message: expect.any(String),
      amount: fundRequest.amount,
      prevBalance: 1000,
      balance: 1000 - fundRequest.amount,
      transaction_ref: expect.any(String)
    })
  });

  it('should transfer from one account to another',async () => {
    let fundRequest: TransferDto = {
      amount: 10,
      account_to_credit: account2.account_number,
      account_to_debit: account1.account_number,
      pin: 1234
    }
    expect(await service.transfer(fundRequest, account1.user_email))
    .toEqual<FundResponse>({
      message: expect.any(String),
      amount: fundRequest.amount,
      prevBalance: 990,
      balance: 990 - fundRequest.amount,
      transaction_ref: expect.any(String)
    })
  });
});
