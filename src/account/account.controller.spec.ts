import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Knex } from 'nestjs-knex';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import AccountType from './enums/AccountTypes';
import { ACCOUNT_SERVICE } from './interfaces/account.interface';
import { CreateAccountResponse } from './interfaces/reponses/createAccountResponse';
import mockAccountService from './mocks/account.servcice.mock';

describe('AccountController', () => {
  let controller: AccountController;
  
  // Sample request
  let createRequest: CreateAccountDto = {
    user_email: 'john.mayor@mail.com',
    user_id: 1,
    user_phone_number: '09009987765',
    type: AccountType.CURRENT
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        ConfigModule.forRoot({
          envFilePath: ['.dev.env'] // Change in production
        }),
        PassportModule
      ],
      controllers: [AccountController],
      providers: [
        JwtStrategy,
        { provide: ACCOUNT_SERVICE, useClass: AccountService }
      ],
    })
    .overrideProvider(ACCOUNT_SERVICE)
    .useValue(mockAccountService)
    .compile();

    controller = module.get<AccountController>(AccountController);
  });

  // All dependencies should be in place
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should create an account', async ()=>{
  //   expect( await controller.create(createRequest))
  //   .toEqual<CreateAccountResponse>({
  //     id: 1,
  //     account_number: '0000000001',
  //     type: createRequest.type
  //   })
  // })
});
