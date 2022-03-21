import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { Account } from '../account/entities/account.entity';
import { DEV_CONNECTION } from '../database/knexfile';
import { FundDto } from './dto/fund.dto';
import { IPaymentService } from './interfaces/payment.interface';
import { FundResponse } from './interfaces/response/FundResponse';
import {  randomBytes} from 'crypto';
import { InterTransaction, IntraTransaction, TransactionHistory } from './entities/payment.entity';
import { TransactionType } from './enums/TransactionType';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class PaymentService implements IPaymentService {

    constructor(
        @InjectKnex(DEV_CONNECTION) private readonly knex: Knex
    ) {}
    

    private async generateTransactionReference(){
        let prefix = 'P' + randomBytes(6).toString('hex');
        let suffix = Math.ceil(Math.random() * Date.now()).toPrecision(8).toString().replace(".", "");
        let ref = prefix + '-' + suffix;
        
        return ref
    }
    
    public async fundAccount(fundDto: FundDto, email: string): Promise<FundResponse> {
        
        // Fetch account balance
        let result = await this.knex<Account>('account')
        .select('balance', 'account_pin')
        .where('account_number', '=', fundDto.account_number)
        .andWhere('user_email', '=', email)
        .first();

        // If account not found
        if (!result) {
            throw new BadRequestException('Account not found ');
        }

        // If account pin doesn't match
        if (result.account_pin !== fundDto.pin) {
            throw new BadRequestException('Incorrect Pin');
        }

        // Add amount to balance
        let updatedBalance = result.balance + fundDto.amount;

        // Generate transaction reference
        let ref = await this.generateTransactionReference();

        if (ref) {
            // Update the account balance
            await this.knex<Account>('account').update('balance', updatedBalance.toFixed(2))
            .where('account_number', '=', fundDto.account_number)
            .andWhere('user_email', '=', email);

            // Add transaction to the transaction table
            let transaction = new InterTransaction();
            transaction.account_number = fundDto.account_number;
            transaction.amount = fundDto.amount;
            transaction.comments = fundDto.comments;
            transaction.type = TransactionType.FUND;
            transaction.reference = ref;
            await this.knex<InterTransaction>('inter_transaction').insert(transaction);

            // Add to transaction history
            let history: TransactionHistory = new TransactionHistory();
            history.account_number = fundDto.account_number;
            history.credit = true;
            history.transaction_ref = ref;
            history.user_email = email;

            await this.knex<TransactionHistory>('transaction_history').insert(history);

            return{
                message: 'Account successfully funded',
                amount: fundDto.amount,
                prevBalance: result.balance,
                balance: updatedBalance,
                transaction_ref: ref,
            }
        }
    }

    public async withdrawFromAccount(fundDto: FundDto, email: string): Promise<FundResponse> {
        // Fetch account balance
        let result = await this.knex<Account>('account')
        .select('balance', 'account_pin')
        .where('account_number', '=', fundDto.account_number)
        .andWhere('user_email', '=', email)
        .first();

        // If account not found
        if (!result) {
            throw new BadRequestException('Account not found ');
        }

        // If account pin doesn't match
        if (result.account_pin !== fundDto.pin) {
            throw new BadRequestException('Incorrect Pin');
        }

        // Check if user has enough balance
        if (result.balance < fundDto.amount) {
            throw new BadRequestException('Account has insufficient funds');
        }

        // Subtract amount from balance
        let updatedBalance = result.balance - fundDto.amount;

        // Generate transaction reference
        let ref = await this.generateTransactionReference();

        if (ref) {
            // Update the account balance
            await this.knex<Account>('account').update('balance', updatedBalance.toFixed(2))
            .where('account_number', '=', fundDto.account_number)
            .andWhere('user_email', '=', email);

            // Add transaction to the transaction table
            let transaction = new InterTransaction();
            transaction.account_number = fundDto.account_number;
            transaction.amount = fundDto.amount;
            transaction.comments = fundDto.comments;
            transaction.type = TransactionType.WITHDRAWAL;
            transaction.reference = ref;
            await this.knex<InterTransaction>('inter_transaction').insert(transaction);

            // Add to transaction history
            let history: TransactionHistory = new TransactionHistory();
            history.account_number = fundDto.account_number;
            history.credit = false;
            history.transaction_ref = ref;
            history.user_email = email;

            await this.knex<TransactionHistory>('transaction_history').insert(history);

            return{
                message: 'Withdrawal successful',
                amount: fundDto.amount,
                prevBalance: result.balance,
                balance: updatedBalance,
                transaction_ref: ref,
            }
        }
    }

    public async transfer(transferDto: TransferDto, email: string): Promise<FundResponse> {

        // If account to debit and credit are the same, not allowed
        if (transferDto.account_to_credit === transferDto.account_to_debit) {
            throw new BadRequestException('Transaction to the same account not allowed');
        }
        // Fetch account to debit balance
        let result = await this.knex<Account>('account')
        .select('balance', 'account_pin')
        .where('account_number', '=', transferDto.account_to_debit)
        .andWhere('user_email', '=', email)
        .first();

        // If account not found
        if (!result) {
            throw new BadRequestException('Account not found ');
        }

        // If account pin doesn't match
        if (result.account_pin !== transferDto.pin) {
            throw new BadRequestException('Incorrect Pin');
        }

        // Check if user has enough balance
        if (result.balance < transferDto.amount) {
            throw new BadRequestException('Account has insufficient funds');
        }

        // Fetch account to credit
        let accountToCredit = await this.knex<Account>('account')
        .where('account_number', '=', transferDto.account_to_credit)
        .first();

        // If account not found
        if (!accountToCredit) {
            throw new BadRequestException('The account to credit was not found');
        }

        // Debit and credit
        let accountToDebitUpdatedBalance = result.balance - transferDto.amount;
        let accountToCreditUpdatedBalance = accountToCredit.balance + transferDto.amount;

        // Generate transaction reference
        let ref = await this.generateTransactionReference();

        if (ref) {
            // Update the debit account balance
            await this.knex<Account>('account').update('balance', accountToDebitUpdatedBalance.toFixed(2))
            .where('account_number', '=', transferDto.account_to_debit)
            .andWhere('user_email', '=', email);

            // Update the credit account balance
            await this.knex<Account>('account').update('balance', accountToCreditUpdatedBalance.toFixed(2))
            .where('account_number', '=', transferDto.account_to_credit)

            // Add transaction to the transaction table
            let transaction = new IntraTransaction()
            transaction.account_credited = transferDto.account_to_credit;
            transaction.account_debited = transferDto.account_to_debit;
            transaction.comments = transferDto.comments;
            transaction.reference = ref;
            transaction.amount = transferDto.amount;
            await this.knex<IntraTransaction>('intra_transaction').insert(transaction);

            // Add to transaction history
            let historyOfDebit: TransactionHistory = new TransactionHistory();
            historyOfDebit.account_number = transferDto.account_to_debit;
            historyOfDebit.credit = false;
            historyOfDebit.transaction_ref = ref;
            historyOfDebit.user_email = email;

            let historyOfCredit: TransactionHistory = new TransactionHistory();
            historyOfCredit.account_number = transferDto.account_to_credit;
            historyOfCredit.credit = true;
            historyOfCredit.transaction_ref = ref;
            historyOfCredit.user_email = accountToCredit.user_email;

            await this.knex<TransactionHistory>('transaction_history').insert([historyOfDebit, historyOfCredit]);

            return{
                message: 'Transfer successful',
                amount: transferDto.amount,
                prevBalance: result.balance,
                balance: accountToDebitUpdatedBalance,
                transaction_ref: ref,
            }
        }
    }
}
