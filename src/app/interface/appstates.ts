import { DataState } from "../enum/datastate.enum";
import { User } from "./user";
import {Events} from "./events";
import {Role} from "./role";

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
    events: Events[];
    roles: Role[];
    access_token: string;
    refresh_token: string;
}
