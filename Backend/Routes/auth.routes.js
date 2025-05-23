// routes/auth.routes.js
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getcurrentUser,
  changeCurrentPassword,
  updateAccountDetails,
} from "../Controllers/auth.controllers.js";
import { verifyJwt } from "../Middleware/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh").post(refreshAccessToken);
router.route("/current-user").get(verifyJwt, getcurrentUser);
router.route('/change-password').post(verifyJwt, changeCurrentPassword);    
router.route('/update-details').post(verifyJwt, updateAccountDetails);

export default router;
