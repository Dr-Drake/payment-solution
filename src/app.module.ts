import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { KnexModule } from 'nestjs-knex';
import { AccountModule } from './account/account.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import knexfile from './database/knexfile';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    KnexModule.forRoot({
      config: knexfile[process.env.NODE_ENV || 'development'],
    }),
    ConfigModule.forRoot({
      envFilePath: ['.dev.env'] // Change in production
    }),
    AccountModule,
    AuthModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
