import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
    
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsString()
    phone_number: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsNotEmpty()
    @IsString()
    first_name: string;
}
