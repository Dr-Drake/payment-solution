import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { KnexModule } from 'nestjs-knex';
import { AccountModule } from './account/account.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import knexfile, { DEV_CONNECTION } from './database/knexfile';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    UserModule,
    KnexModule.forRoot({
      config: knexfile['development'], // change in production
    }, DEV_CONNECTION),
    ConfigModule.forRoot({
      envFilePath: ['.dev.env'] // Change in production
    }),
    AccountModule,
    AuthModule,
    PaymentModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
