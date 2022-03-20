import { CreateAccountDto } from "../dto/create-account.dto";
import { Account } from "../entities/account.entity";
import { CreateAccountResponse } from "./reponses/createAccountResponse";


export const ACCOUNT_SERVICE = 'ACCOUNT SERVICE';

export interface IAccountService{
    createAccount(request: CreateAccountDto): Promise<CreateAccountResponse>;
    findAccountByEmail(email: string): Promise<Account>;
}