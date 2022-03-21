import { Body, Controller, HttpCode, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { FundDto } from './dto/fund.dto';
import { TransferDto } from './dto/transfer.dto';
import { IPaymentService, PAYMENT_SERVICE } from './interfaces/payment.interface';

@Controller('/api/v1/payment')
export class PaymentController {

    constructor(
        @Inject(PAYMENT_SERVICE) private paymentService: IPaymentService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('/fund')
    @HttpCode(200)
    fundAccount(@Body() fundDto: FundDto, @Request() req){
        return this.paymentService.fundAccount(fundDto, req.user.email);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/withdraw')
    @HttpCode(200)
    withdrawFromAccount(@Body() fundDto: FundDto, @Request() req){
        return this.paymentService.withdrawFromAccount(fundDto, req.user.email);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/withdraw')
    @HttpCode(200)
    transfer(@Body() transferDto: TransferDto, @Request() req){
        return this.paymentService.transfer(transferDto, req.user.email);
    }
    
}
