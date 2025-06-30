import express from "express";

import {
  createPost,
  deleteFile,
  deletePost,
  getAllPosts,
  getFilePreview,
  getMyPosts,
  getPostBySlug,
  updatePost,
} from "../Controllers/post.controllers.js";
import { verifyJwt } from "../Middleware/auth.middleware.js";
import { upload } from "../Middleware/multer.middleware.js";

const router = express.Router();

// Public routes
router.get("/all-posts", getAllPosts);
router.get("/:slug", getPostBySlug);

// Protected routes
router.post(
  "/create-post",
  verifyJwt,
  upload.single("featuredImage"), // use single instead of fields
  createPost
);
// Protected Route
router.get("/current-user-posts", verifyJwt, getMyPosts);

router.put(
  "/update-posts/:slug",
  verifyJwt,
  upload.single("featuredImage"), // use single instead of fields
  updatePost
);
router.delete("/delete-post/:slug", verifyJwt, deletePost);

// File routes
router.delete("/file/:fileId", deleteFile);
router.get("/file/:fileId/preview", getFilePreview);

export default router;
