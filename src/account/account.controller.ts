import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreatePinDto } from './dto/create-pin.dto';
import { ACCOUNT_SERVICE, IAccountService } from './interfaces/account.interface';

@Controller('/api/v1/account')
export class AccountController {
  constructor(
    @Inject(ACCOUNT_SERVICE) private readonly accountService: IAccountService
  ) {}

  // @UseGuards(JwtAuthGuard)
  // @Post()
  // create(@Body() createAccountDto: CreateAccountDto) {
  //   return this.accountService.createAccount(createAccountDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('pin')
  createPin(@Body() request: CreatePinDto, @Request() req){
    return this.accountService.createAccountPin(request, req.user.email);
  }
}
