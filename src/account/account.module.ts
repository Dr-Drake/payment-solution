import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { ACCOUNT_SERVICE } from './interfaces/account.interface';

@Module({
  controllers: [AccountController],
  providers: [
    { provide: ACCOUNT_SERVICE, useClass: AccountService }
  ],
  exports:[{ provide: ACCOUNT_SERVICE, useClass: AccountService }]
})
export class AccountModule {}
