import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserModule } from '../src/user/user.module';
import { Knex, KnexModule } from 'nestjs-knex';
import knexfile, { DEV_CONNECTION, TEST_CONNECTION } from '../src/database/knexfile';
import { type } from 'os';
import { User } from '../src/user/entities/user.entity';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import knex from 'knex';
import { IUserService, USER_SERVICE } from '../src/user/interfaces/user.interfaace';
import { AccountNumberEntity } from '../src/account/entities/account.entity';
import { CreateUserResponse } from '../src/user/interfaces/responses/createResponse';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let db: Knex;

  beforeAll(async () => {
    db = knex(knexfile['testing']);
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            UserModule,
            KnexModule.forRoot({
                config: knexfile['testing'],
            }, DEV_CONNECTION),
        ],
    })
    .overrideProvider(DEV_CONNECTION)
    .useValue(db)
    .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
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
});
