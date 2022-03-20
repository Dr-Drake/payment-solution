import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { ACCOUNT_SERVICE } from './interfaces/account.interface';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[AuthModule],
  controllers: [AccountController],
  providers: [
    { provide: ACCOUNT_SERVICE, useClass: AccountService }
  ],
  exports:[{ provide: ACCOUNT_SERVICE, useClass: AccountService }]
})
export class AccountModule {}
