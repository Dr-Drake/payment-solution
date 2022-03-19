import { User } from "src/user/entities/user.entity";

export interface LoginResponse extends User{
    access_token: string;
}