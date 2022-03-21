import { IsNotEmpty, IsNumber, IsNumberString } from "class-validator";

export class FundDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsNumberString()
    account_number: string;

    @IsNotEmpty()
    @IsNumber()
    pin: number;

    comments?: string
}