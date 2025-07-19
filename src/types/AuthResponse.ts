import {Tokens} from "./Token.js";
import UserDto from "../dtos/userDto.js";

export type AuthResponse = Tokens & {user: UserDto}