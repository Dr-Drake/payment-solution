import { HttpStatus } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../entities/user.entity";
import { CreateUserResponse } from "./responses/createResponse";
import { FetchUserResponse } from "./responses/fetchUserResponse";

export const USER_SERVICE = 'USER SERVICE';

export interface IUserService{
    createUser(request: CreateUserDto): Promise<CreateUserResponse>;
    findAllUsers(): Promise<FetchUserResponse[]>;
    findUserById(id: number): Promise<FetchUserResponse>;
    findUserByEmail(email: string): Promise<FetchUserResponse>;
    findUserByPhoneNumber(phone_number: string): Promise<FetchUserResponse>;
}