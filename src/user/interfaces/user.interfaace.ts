import { HttpStatus } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../entities/user.entity";
import { CreateUserResponse } from "./responses/createResponse";

export const USER_SERVICE = 'USER SERVICE';

export interface IUserService{
    createUser(request: CreateUserDto): Promise<CreateUserResponse>;
    findAllUsers(): Promise<User[]>;
    findUserById(id: number): Promise<User>;
    findUserByEmail(email: string): Promise<User>;
    findUserByPhoneNumber(phone_number: string): Promise<User>;
}