import { CreateAccountDto } from "../dto/create-account.dto";
import { CreatePinDto } from "../dto/create-pin.dto";
import { Account } from "../entities/account.entity";
import { CreateAccountResponse } from "./reponses/createAccountResponse";
import { CreatePinResponse } from "./reponses/createPinResponse";


export const ACCOUNT_SERVICE = 'ACCOUNT SERVICE';

export interface IAccountService{
    createAccount(request: CreateAccountDto): Promise<CreateAccountResponse>;
    findAccountByEmail(email: string): Promise<Account>;
    createAccountPin(request: CreatePinDto, email: string): Promise<CreatePinResponse>;
}