import { FetchUserResponse } from "./fetchUserResponse";

export interface CreateUserResponse extends FetchUserResponse{
    account_number: string;
}