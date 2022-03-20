import { Test, TestingModule } from '@nestjs/testing';
import { Knex, KnexModule } from 'nestjs-knex';
import knex from 'knex';
import { AccountService } from '../account/account.service';
import knexfile, { DEV_CONNECTION } from '../database/knexfile';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResponse } from './interfaces/responses/createResponse';
import { UserService } from './user.service';
import { ACCOUNT_SERVICE } from '../account/interfaces/account.interface';
import { AccountNumberEntity } from 'src/account/entities/account.entity';

describe('UserService', () => {
  let service: UserService;
  let db: Knex;

  beforeAll(async () => {
    db = knex(knexfile['testing']);
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        KnexModule.forRoot({
          config: knexfile['testing'],
        }, DEV_CONNECTION),
      ],
      providers: [ 
        UserService,
        { provide: ACCOUNT_SERVICE, useClass: AccountService } 
      ],
    })
    .overrideProvider(DEV_CONNECTION)
    .useValue(db)
    .compile();

    service = module.get<UserService>(UserService);
  });

  afterAll(async () => {
    // Delete all existing entries in tables
    await db('account').del();
    await db('user').del();

    // Reset account numbers to unused
    await db<AccountNumberEntity>('account_numbers').update('used', false);

    // Close connection
    db.destroy();
})

  /** Mock Inputs */
  let createRequest: CreateUserDto = {
    email: 'john.mayor@mail.com',
    password: 'jkwjkjkw',
    phone_number: '09009987765',
    last_name: 'John',
    first_name: 'Mayor'
  }

  // Make sure dependencies are in place
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user and an account for the user', async() => {
    expect( await service.createUser(createRequest))
    .toEqual<CreateUserResponse>({
      id: expect.any(Number),
      email: createRequest.email,
      phone_number: createRequest.phone_number,
      last_name: createRequest.last_name,
      first_name: createRequest.first_name,
      account_number: expect.any(String)
    })
  });
});
