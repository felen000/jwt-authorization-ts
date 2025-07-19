import jwt from "jsonwebtoken";
import {query} from "../db.js";
import UserDto from "../dtos/userDto.js";
import {Token, Tokens} from "../types/Token.js";

class TokenService {
    generateTokens(payload: UserDto): Tokens {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15s'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '15d'});

        return {
            accessToken,
            refreshToken,
        }
    }

    async saveToken(userId: number, refreshToken: string): Promise<Token> {
        const {rows: tokenDataRows} = await query<Token>('SELECT * FROM tokens WHERE user_id=$1', [userId]);
        if (tokenDataRows.length > 0) {
            const {rows: updatedTokenRows} = await query<Token>('UPDATE tokens SET refreshToken=$1 ' +
                                                        'WHERE user_id=$2 RETURNING *', [refreshToken, userId])
            return updatedTokenRows[0];
        }

        const {rows: newTokenRows} = await query<Token>('INSERT INTO tokens (user_id, refreshToken) ' +
                                                'VALUES ($1,$2)', [userId, refreshToken])
        return newTokenRows[0];
    }

    async removeToken(refreshToken: string): Promise<Token> {
        const {rows: tokenRows} = await query<Token>('DELETE FROM tokens WHERE refreshToken=$1 RETURNING *', [refreshToken]);
        return tokenRows[0];
    }

    async findToken(refreshToken: string): Promise<Token> {
        const {rows: tokenRows} = await query<Token>('SELECT * FROM tokens WHERE refreshToken=$1', [refreshToken]);
        return tokenRows[0];
    }

    validateAccessToken(token: string): UserDto|null {
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as UserDto;
            return userData;
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token: string): UserDto|null {
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET) as UserDto;
            return userData;
        } catch (e) {
            return null
        }
    }
}

export default new TokenService();