import {query} from '../db.js';
import bcrypt from "bcrypt";
import {v4} from 'uuid';
import mailService from "./mailService.js";
import tokenService from "./tokenService.js";
import UserDto from "../dtos/userDto.js";
import ApiError from "../exceptions/apiError.js";
import {AuthResponse} from "../types/AuthResponse.js";
import {User} from "../types/User.js";

class UserService {
    async registration(email: string, password: string): Promise<AuthResponse> {
        const {rows: candidateRows} = await query<User>('SELECT * FROM users WHERE email=$1', [email]);
        const candidate = candidateRows[0];
        if (candidate) {
            throw ApiError.BadRequestError(`Email ${email} already in use`);
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const activationLink = v4()
        const {rows: newUserRows} = await query<User>(`INSERT INTO users (email, password, activationLink) 
                                            VALUES ($1, $2, $3) RETURNING *`,
            [email, hashPassword, activationLink]);
        const newUser = newUserRows[0];
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        const userDto = new UserDto(newUser);
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        const {rows: userRows} = await query<User>('SELECT * FROM users WHERE email=$1', [email]);
        const user = userRows[0];
        if (!user) {
            throw ApiError.BadRequestError(`User whith email ${email} not found`);
        }
        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            throw ApiError.BadRequestError(`Invalid password`);
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async logout(refreshToken: string) {
        return await tokenService.removeToken(refreshToken);
    }

    async activate(activationLink: string): Promise<void> {
        const {rows: userRows} = await query<User>('SELECT * FROM users WHERE activationLink=$1', [activationLink]);
        const user = userRows[0]
        if (!user) {
            throw ApiError.BadRequestError(`Incorrect activation link`);
        }
        await query(`UPDATE users SET isActivated=TRUE WHERE id=${user.id}`);
    }

    async refresh(refreshToken:string): Promise<AuthResponse> {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const {rows: userRows} = await query<User>('SELECT * FROM users WHERE id=$1', [userData.id]);
        const userDto = new UserDto(userRows[0]);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto};
    }

    async getAllUsers(): Promise<User[]> {
        const {rows: userRows} = await query<User>('SELECT * FROM users');
        return userRows;
    }
}

export default new UserService();