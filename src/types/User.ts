export interface User {
    id: number;
    email: string;
    password: string;
    isactivated: boolean;
    activationlink: string;
}