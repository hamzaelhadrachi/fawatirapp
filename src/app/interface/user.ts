export interface User {

    id: string;
    firstName: string;
    lastName: string;
    email: string;
    address?: string;
    phone?: string;
    title?: string;
    bio?: string;
    enabled: boolean;
    isNotLocked: boolean;
    isUsingMfa: boolean;
    createdAt?: Date;
    imageUrl?: string;
    roleName: string;
    permissions: string;

}
