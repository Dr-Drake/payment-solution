import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserModule } from '../src/user/user.module';
import { Knex, KnexModule } from 'nestjs-knex';
import knexfile, { TEST_CONNECTION } from '../src/database/knexfile';
import { type } from 'os';
import { User } from '../src/user/entities/user.entity';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import knex from 'knex';
import { IUserService, USER_SERVICE } from 'src/user/interfaces/user.interfaace';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let knex: Knex;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            UserModule,
            KnexModule.forRoot({
                config: knexfile['testing'],
            }, TEST_CONNECTION),
        ],
    })
    .compile();
    app = moduleFixture.createNestApplication();
    knex = moduleFixture.get<Knex>(TEST_CONNECTION);
    await app.init();
  });

  afterAll(async () => {
      // Delete all existing entries in tables
      await knex('user').del();
      await knex('account').del();

      // Reset account numbers to unused
      knex.schema.alterTable('account_numbers', (table)=>{
        table.boolean('used').defaultTo(false).alter();
      })
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
          expect(response.body).toEqual<User>({
            id: expect.any(Number),
            email: createRequest.email;
            password: createRequest.password;
            phone_number: string;
            last_name: string;
            first_name: string;
            created_at?: Date;
            updated_at ?: Date;
          })
      })
  });
});
