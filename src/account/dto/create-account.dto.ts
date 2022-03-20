import AccountType from "../enums/AccountTypes";

export class CreateAccountDto {
    user_id: number;
    user_email: string;
    user_phone_number: string;
    type: AccountType;
}
