import { DataState } from "../enum/datastate.enum";
import { User } from "./user";

export interface LoginState {
    dataState: DataState;
    loginSuccess?: boolean;
    message?: string;
    isUsingMfa: boolean;
    phone: string;
    error?: string;
}

export interface CustomHttpResponse<T> {
    timeStamp: Date;
    statusCode: number;
    status: string;
    reason?: string;
    message: string;
    developerMessage?: string;
    data?: T; 
}

export interface Profile{
    user?: User;
    access_token: string;
    refresh_token: string;
}