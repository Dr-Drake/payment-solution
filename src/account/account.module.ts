import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { ACCOUNT_SERVICE } from './interfaces/account.interface';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[PassportModule],
  controllers: [AccountController],
  providers: [
    JwtStrategy,
    { provide: ACCOUNT_SERVICE, useClass: AccountService }
  ],
  exports:[
    { provide: ACCOUNT_SERVICE, useClass: AccountService }
  ]
})
export class AccountModule {}
