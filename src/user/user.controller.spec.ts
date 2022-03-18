import { Test, TestingModule } from '@nestjs/testing';
import { USER_SERVICE } from './interfaces/user.interfaace';
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

  /** Tests */

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', ()=>{})
});
