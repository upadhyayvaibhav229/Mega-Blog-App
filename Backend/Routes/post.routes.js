import express from 'express';

import {
    createPost,
    deleteFile,
    deletePost,
    getAllPosts,
    getFilePreview,
    getPostBySlug,
    updatePost,
    uploadFile
} from '../Controllers/post.controllers.js';
import { verifyJwt } from '../Middleware/auth.middleware.js';
import { upload } from '../Middleware/multer.middleware.js';

const router = express.Router();

// Public
router.get('/all-posts', getAllPosts);
router.get('/posts/:slug', getPostBySlug);

// Protected
router.post("/create-post", verifyJwt, upload.single("file"), createPost);
router.put('/update-posts/:slug', verifyJwt, updatePost);
router.delete('/delete-post/:slug', verifyJwt, deletePost);

// fileupload route
router.post('/upload-file', verifyJwt, uploadFile);
router.delete("/file/:fileId", deleteFile);
router.get("/file/:fileId/preview", getFilePreview);

export default router;
