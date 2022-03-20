import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { USER_SERVICE } from './interfaces/user.interfaace';
import { AccountModule } from '../account/account.module';

@Module({
  imports:[AccountModule],
  controllers: [UserController],
  providers: [{ provide: USER_SERVICE, useClass: UserService }],
  exports:[{ provide: USER_SERVICE, useClass: UserService }]
})
export class UserModule {}
