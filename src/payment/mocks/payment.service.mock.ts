import { FundDto } from "../dto/fund.dto";
import { TransferDto } from "../dto/transfer.dto";
import { FundResponse } from "../interfaces/response/FundResponse";

const mockPaymentService = {
    fundAccount: jest.fn().mockImplementation((request: FundDto, email: string): Promise<FundResponse>=>{
        let result: FundResponse = {
            message: 'Account successfully funded',
            amount: request.amount,
            prevBalance: 100,
            balance: 100 + request.amount,
            transaction_ref: "REF123"
        }

       return Promise.resolve(result);
    }),
        
    withdrawFromAccount: jest.fn().mockImplementation((request: FundDto, email: string): Promise<FundResponse>=>{
        let result: FundResponse = {
            message: 'Withdrawal successful',
            amount: request.amount,
            prevBalance: 1000,
            balance: 1000 - request.amount,
            transaction_ref: "REF123"
        }

       return Promise.resolve(result);
    }),

    transfer: jest.fn().mockImplementation((request: TransferDto, email: string): Promise<FundResponse>=>{
        let result: FundResponse = {
            message: 'Transfer successful',
            amount: request.amount,
            prevBalance: 100,
            balance: 100 - request.amount,
            transaction_ref: "REF123"
        }

       return Promise.resolve(result);
    }),
    
}

export default mockPaymentService;