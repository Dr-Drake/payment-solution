import { FundDto } from "../dto/fund.dto";
import { TransferDto } from "../dto/transfer.dto";
import { FundResponse } from "./response/FundResponse";

export const PAYMENT_SERVICE = 'PAYMENT SERVICE';

export interface IPaymentService{
    fundAccount(fundDto: FundDto, email: string): Promise<FundResponse>;
    withdrawFromAccount(fundDto: FundDto, email: string): Promise<FundResponse>;
    transfer(transferDto: TransferDto, email: string): Promise<FundResponse>;
}