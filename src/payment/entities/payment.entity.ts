import { TransactionType } from "../enums/TransactionType";

export class IntraTransaction {
    id: number;
    account_credited: string;
    account_debited: string;
    amount: number;
    reference: string;
    comments?: string;
    created_at?: Date;
    updated_at?: Date;
}

export class InterTransaction{
    id: number;
    account_number: string;
    type: TransactionType;
    amount: number;
    reference: string;
    comments?: string;
    created_at?: Date;
    updated_at?: Date;
}

export class TransactionHistory{
    id: number;
    user_email: string;
    account_number: string;
    transaction_ref: string;
    credit: boolean;
}