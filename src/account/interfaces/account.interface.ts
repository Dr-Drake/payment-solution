import { CreateAccountDto } from "../dto/create-account.dto";
import { CreateAccountResponse } from "./reponses/createAccountResponse";


export const ACCOUNT_SERVICE = 'ACCOUNT SERVICE';

export interface IAccountService{
    createAccount(request: CreateAccountDto): Promise<CreateAccountResponse>
}