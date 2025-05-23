import { Posts } from "../model/post.model";
import { asyncHandler } from "../utils/asynchandler";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


const createPost = asyncHandler(async (req, res) => {
    const { title, slug, content, featuredImage, status, userId, author } = req.body;

    if ([title, slug, content, featuredImage, status, userId, author].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }
        
    const post = await Posts.create({ title, slug, content, featuredImage, status, userId, author });
    return res.status(201).json(new ApiResponse(true, "Post created successfully", post));
});

const updatePost = asyncHandler(async (params) => {
    const { title, content, featuredImage, status } = req.body;
})

export {
    createPost
}