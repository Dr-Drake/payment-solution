import { User } from "src/user/entities/user.entity";
import { LoginResponse } from "./responses/LoginResponse";

export const AUTH_SERVICE = 'AUTH SERVICE';

export interface IAuthService{
    validateUser(email: string, password: string): Promise<User>;
    login(user: User): Promise<LoginResponse>;
}