import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { PAYMENT_SERVICE } from './interfaces/payment.interface';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports:[
    PassportModule 
  ],
  controllers: [PaymentController],
  providers: [
    JwtStrategy,
    { provide: PAYMENT_SERVICE, useClass: PaymentService }
  ]
})
export class PaymentModule {}
