import UserDto from "../../dtos/userDto.js";

declare global {
    declare namespace Express {
        interface Request {
            user?: UserDto;
        }
    }
}