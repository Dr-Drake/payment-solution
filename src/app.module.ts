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
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    
    KnexModule.forRoot({
      config: knexfile['development'], // change in production
    }, DEV_CONNECTION),
    ConfigModule.forRoot({
      envFilePath: ['.dev.env'] // Change in production
    }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '10h' }
    }),
    UserModule,
    AccountModule,
    AuthModule,
    PaymentModule
  ],
})
export class AppModule {}
