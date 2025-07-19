import userService from "../service/userService.js";
import {validationResult} from "express-validator";
import ApiError from "../exceptions/apiError.js";
import UserService from "../service/userService.js";
import {NextFunction, Request, Response} from "express";
import {AuthResponse} from "../types/AuthResponse.js";
import {User} from "../types/User.js";

interface AuthBody {
    email: string;
    password: string;
}

class UserController {
    async registration(
        req: Request<{}, {}, AuthBody>,
        res: Response<AuthResponse>,
        next: NextFunction
    ): Promise<Response<AuthResponse> | void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequestError('Validation Error', errors.array()));
            }
            const {email, password} = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e)
        }
    }

    async login(
        req: Request<{}, {}, AuthBody>,
        res: Response<AuthResponse>,
        next: NextFunction
    ): Promise<Response<AuthResponse> | void> {
        try {
            const {email, password} = req.body;
            const userData = await UserService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e)
        }
    }

    async logout(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response<{ token: string }> | void> {
        try {
            const {refreshToken} = req.cookies;
            const token = await UserService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json({token});
        } catch (e) {
            next(e)
        }
    }

    async activate(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink)
            res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e)
        }
    }

    async refresh(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response<AuthResponse> | void> {
        try {
            const {refreshToken} = req.cookies;
            const userData = await UserService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e)
        }
    }

    async getUsers(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response<User[]> | void> {
        try {
            const users = await UserService.getAllUsers();
            res.json(users)
        } catch (e) {
            next(e)
        }
    }


}

export default new UserController();