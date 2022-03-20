import { CreateAccountDto } from "../dto/create-account.dto";
import { Account } from "../entities/account.entity";
import AccountType from "../enums/AccountTypes";
import { CreateAccountResponse } from "../interfaces/reponses/createAccountResponse";

const mockAccountService = {
    createAccount: jest.fn().mockImplementation((request: CreateAccountDto): Promise<CreateAccountResponse>=>{
        return Promise.resolve({

            id: 1,
            account_number: '0000000001',
            type: request.type
        })
    }),

    findAccountByEmail: jest.fn().mockImplementation((email: string): Promise<Account>=>{
        return Promise.resolve({
            id: 1,
            account_number: '0000000001',
            balance: 0.0,
            user_id: 1,
            user_email: email,
            user_phone_number: '09090000008',
            account_pin: null,
            type: AccountType.CURRENT,
            created_at: new Date(),
            updated_at: new Date(),
        })
    }),
}

export default mockAccountService;