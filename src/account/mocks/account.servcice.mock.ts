import { CreateAccountDto } from "../dto/create-account.dto";
import { CreateAccountResponse } from "../interfaces/reponses/createAccountResponse";

const mockAccountService = {
    createAccount: jest.fn().mockImplementation((request: CreateAccountDto): Promise<CreateAccountResponse>=>{
        return Promise.resolve({

            id: 1,
            account_number: '0000000001',
            type: request.type
        })
    }),
}

export default mockAccountService;