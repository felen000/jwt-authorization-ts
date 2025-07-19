import ApiError from "../exceptions/apiError.js";
import tokenService from "../service/tokenService.js";
import {NextFunction, Request, Response} from "express";
import UserDto from "../dtos/userDto.js";

export default (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];

        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken) as UserDto;
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        req.user = userData;
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
}