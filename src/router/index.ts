import Router from 'express';
import userController from "../controllers/userController.js";
import {body} from "express-validator";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:4, max:8}),
    userController.registration);
router.post('/login', userController.login)
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)

export default router;