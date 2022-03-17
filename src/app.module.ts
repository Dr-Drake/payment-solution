import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { KnexModule } from 'nestjs-knex';
import knexfile from './database/knexfile';

@Module({
  imports: [
    UserModule,
    KnexModule.forRoot({
      config: knexfile[process.env.NODE_ENV || 'development'],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
