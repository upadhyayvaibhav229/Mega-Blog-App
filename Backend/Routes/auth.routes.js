import {Router} from 'express'
import {
    loginUser,
    logoutUser,
    registerUser,
    refershAccessToken,
} from "../Controllers/auth.controllers.js";
import { verifyJwt } from '../Middleware/auth.middleware.js';

const router = Router()

router.post('/login', loginUser);
router.post('/logout', logoutUser, verifyJwt);
router.post('/registerUser', registerUser);
router.post('/refershAccessToken', refershAccessToken, verifyJwt);

export default router