import { BadRequestException, Injectable, NotImplementedException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { DEV_CONNECTION } from '../database/knexfile';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreatePinDto } from './dto/create-pin.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, AccountNumberEntity } from './entities/account.entity';
import { IAccountService } from './interfaces/account.interface';
import { CreateAccountResponse } from './interfaces/reponses/createAccountResponse';
import { CreatePinResponse } from './interfaces/reponses/createPinResponse';

@Injectable()
export class AccountService implements IAccountService {

  constructor(
    @InjectKnex(DEV_CONNECTION) private knex: Knex
  ) {}

  public async createAccount(request: CreateAccountDto): Promise<CreateAccountResponse> {
    
    // Get an unassigned account number
    let account_record = await this.knex<AccountNumberEntity>('account_numbers')
    .where('used', '=', false)
    .first();

    // Create account
    const account: Account = new Account();
    account.account_number = account_record.unique_number;
    account.user_email = request.user_email;
    account.user_id = request.user_id;
    account.user_phone_number = request.user_phone_number;
    account.type = request.type;

    let returningOptions = ['id'];
    let result = await this.knex<Account>('account').insert(account, returningOptions);

    if (result && result.length > 0) {

      // Mark account number as assigned
      await this.knex<AccountNumberEntity>('account_numbers')
      .where('unique_number', '=', account.account_number)
      .update('used', true, ['used']);

      let response: CreateAccountResponse = {
        id: result[0],
        account_number: account.account_number,
        type: account.type,
      }

      return response;
    }
  }

  public async createAccountPin(request: CreatePinDto, email: string): Promise<CreatePinResponse> {

    // First check if account exists
    let account = await this.knex<Account>('account')
    .where('account_number', '=', request.account_number)
    .andWhere('user_email', '=', email)
    .first();

    // If account not found
    if (!account) {
      throw new BadRequestException('Account not found for this user');
    }
    
    // Update pin for account
    await this.knex<Account>('account').update('account_pin', request.pin)
    .where('account_number', '=', request.account_number)
    .andWhere('user_email', '=', email);

    return{
      message: 'Success',
      account_number: request.account_number,
    }
  }

  public async findAccountByEmail(email: string): Promise<Account> {
    let account = await this.knex<Account>('account').where('user_email', '=', email).first();
    return account;
  }

}
