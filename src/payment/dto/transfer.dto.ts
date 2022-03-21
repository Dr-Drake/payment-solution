export class TransferDto {
    amount: number;
    account_to_credit: string;
    account_to_debit: string;
    comments?: string
}