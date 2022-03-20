import AccountType from "../enums/AccountTypes";

export class Account {
    id: number;
    account_number: string;
    balance: number;
    user_id: number;
    user_email: string;
    user_phone_number: string;
    account_pin: number;
    type: AccountType;
    created_at?: Date;
    updated_at?: Date;
}

export class AccountNumberEntity{
    id: number;
    unique_number: string;
    used: boolean;
}
