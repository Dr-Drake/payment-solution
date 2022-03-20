import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateAccountDto } from './dto/create-account.dto';
import { ACCOUNT_SERVICE, IAccountService } from './interfaces/account.interface';

@Controller('account')
export class AccountController {
  constructor(
    @Inject(ACCOUNT_SERVICE) private readonly accountService: IAccountService
  ) {}

  /**
   * Incase you want to create other types of accounts
   * @param createAccountDto 
   * @returns 
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.createAccount(createAccountDto);
  }
}
