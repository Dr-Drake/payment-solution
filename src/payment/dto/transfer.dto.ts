import { IsNotEmpty, IsNumber, IsNumberString } from "class-validator";

export class TransferDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsNumberString()
    account_to_credit: string;

    @IsNotEmpty()
    @IsNumberString()
    account_to_debit: string;

    @IsNotEmpty()
    @IsNumber()
    pin: number;

    comments?: string
}