import AccountType from "src/account/enums/AccountTypes";

export interface CreateAccountResponse{
    id: number;
    account_number: string;
    type: AccountType;
}