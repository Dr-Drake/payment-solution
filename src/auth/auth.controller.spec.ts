import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { KnexModule } from 'nestjs-knex';
import knexfile, { DEV_CONNECTION } from '../database/knexfile';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AUTH_SERVICE } from './interfaces/auth.interface';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        PassportModule,
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
      controllers: [AuthController],
      providers:[{ provide: AUTH_SERVICE, useClass: AuthService }]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
