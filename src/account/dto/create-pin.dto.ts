import { IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

export class CreatePinDto{
    @IsNotEmpty()
    @IsNumberString()
    account_number: string;

    @IsNotEmpty()
    @IsNumber()
    pin: number
}