import { FetchUserResponse } from "../../../user/interfaces/responses/fetchUserResponse";

export interface LoginResponse extends FetchUserResponse{
    access_token: string;
}