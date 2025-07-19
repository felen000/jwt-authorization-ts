import {User} from "../types/User.js";

export default class UserDto {
    email: string;
    id: number;
    isActivated: boolean;
    constructor(data: User) {
        this.id = data.id;
        this.email = data.email;
        this.isActivated = data.isactivated;
    }
}

export type UserType = Pick<User, "id" | "email">;