import { Posts } from "../model/post.model.js";
import { asyncHandler } from "../utils/asynchandler";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


const createPost = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(400,"Unauthorized to create a post")
    }
    const { title, slug, content, featuredImage, status } = req.body;

    if ([title, slug, content, featuredImage, status].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }
        
    const newPost = await Posts.create({ 
        title, 
        slug, 
        content, 
        featuredImage, 
        status, 
        userId: req.user._id, 
        author: req.user._id, 
    });
    const Posts = await newPost.save();
    return res.status(201).json(new ApiResponse(true, "Post created successfully", Posts));
});

// get all published post
const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Posts.find({status: 'published'}).sort({createAt: -1})
    return res.status(200).json(new ApiResponse(true,"All Posts ", posts));

})

// get a single posts by slug (public routes)
const getPostBySlug = asyncHandler(async (req, res) => {
    const slug = req.params;
    const post = await Posts.findOne({slug});
    if (!post) {
        throw new ApiError(400, "Post not found");
    }

    return res.status(200).json(new ApiResponse(true, "Post found", post));
})

const updatePost = asyncHandler(async (req, res) => {
    if (!req.user) throw new ApiError(401, "Not Authorize to edit the Post");

    const {slug} = req.params;
    const {title, content, featuredImage, status} = req.body;
    const post = await Posts.findOne({slug})

    if (!post) throw new ApiError(404, "Post not found");

    // check ownership 
    if(!post.userId.equals(req.user._id)) {
        throw new ApiError(401, "Not Authorize to edit the Post");
    }

    // update only provided field
    if(title !== undefined) post.title = title;
    if(content !== undefined) post.content = content;
    if(featuredImage !== undefined) post.featuredImage = featuredImage;
    if(status !== undefined) post.status = status;

    const updatedPost = await post.save();
    return res.status(200).json(new ApiResponse(true, "Post updated successfully", updatedPost));

})

export {
    createPost,
    getAllPosts,
    getPostBySlug,
    updatePost
}