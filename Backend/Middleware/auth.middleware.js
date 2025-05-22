import jwt from "jsonwebtoken";
import { User } from "../Models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      req.user = null; // Allow token-less requests (e.g. logout)
      return next();
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log("Decoded Token:", decodedToken); // ✅ Debugging

    if (!decodedToken || !decodedToken._id) {
      throw new ApiError(401, "Invalid Access Token");
    }

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "User not found for provided token");
    }

    req.user = user;

    // ✅ Safely inject userId into req.body
    req.body = req.body || {};
    req.body.userId = decodedToken._id;

    console.log("Injected userId into req.body:", req.body); // ✅ Debugging

    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    req.user = null;
    next(); // Let downstream handle unauthorized access
  }
});

//  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODE5ZWQzZjYwZjJlOThhOTllMjgwMjEiLCJlbWFpbCI6InVwYWRoeWF5dmFpYmhhdjIyOUBnbWFpbC5jb20iLCJmdWxsTmFtZSI6InZhaWJoYXYgdXBhZGQiLCJpYXQiOjE3NDY2MTgyMDksImV4cCI6MTc0NjcwNDYwOX0.yqy__qSNwfGVUmjLGvGp8v0MZrvvld6FzcelaOuPpbo

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODE5ZWQzZjYwZjJlOThhOTllMjgwMjEiLCJlbWFpbCI6InVwYWRoeWF5dmFpYmhhdjIyOUBnbWFpbC5jb20iLCJmdWxsTmFtZSI6InZhaWJoYXYgdXBhZGQiLCJpYXQiOjE3NDY2MTg0MjksImV4cCI6MTc0NjcwNDgyOX0.uBn2nTfLJdPoMEZFh3mqArzXhQOn0fw6RoA-ADvmYTM
