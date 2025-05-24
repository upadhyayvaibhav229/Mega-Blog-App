import express from 'express';

import {
    createPost,
    deletePost,
    getAllPosts,
    getPostBySlug,
    updatePost
} from '../Controllers/post.controllers.js';
import { verifyJwt } from '../Middleware/auth.middleware.js';

const router = express.Router();

// Public
router.get('/posts', getAllPosts);
router.get('/posts/:slug', getPostBySlug);

// Protected
router.post('/create-posts', verifyJwt, createPost);
router.put('/update-posts/:slug', verifyJwt, updatePost);
router.delete('/posts/:slug', verifyJwt, deletePost);

// Aggregation example (admin/stat)
// router.get('/post-stats', verifyJwt, getPostStats);

export default router;
