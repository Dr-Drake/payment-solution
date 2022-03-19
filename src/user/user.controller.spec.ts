import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { CreateUserResponse } from './interfaces/responses/createResponse';
import { USER_SERVICE } from './interfaces/user.interfaace';
import userDb from './mocks/user.data';
import mockUserService from './mocks/user.service.mock';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: USER_SERVICE, useClass: UserService }],
    })
    .overrideProvider(USER_SERVICE)
    .useValue(mockUserService)
    .compile();

    controller = module.get<UserController>(UserController);
  });

  /** Mock Inputs */
  let createRequest: CreateUserDto = {
    email: 'john.mayor@mail.com',
    password: 'jkwjkjkw',
    phone_number: '09009987765',
    last_name: 'John',
    first_name: 'Mayor'
  }

  /** Tests */

  // Make sure dependencies are in place
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user account', async()=>{
    expect(await controller.create(createRequest))
    .toEqual<CreateUserResponse>({
      ...createRequest,
      account_number: '0446937765'
    })
  });

  it('should fetch all users', async()=>{
    expect(await controller.findAll())
    .toEqual<User[]>(userDb);
  });

  it('should fetch one user by email', async()=>{
    expect(await controller.findUserByEmail('ikem.ezechukwu@mail.com'))
    .toEqual<User>(userDb[0]);
  });

  it('should fetch one user by phone number', async()=>{
    expect(await controller.findUserByPhoneNumber('09359002143'))
    .toEqual<User>(userDb[1]);
  })


});
