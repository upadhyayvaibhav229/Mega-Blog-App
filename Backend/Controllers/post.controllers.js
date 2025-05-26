import { Posts } from "../model/post.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const createPost = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { title, slug, content, status } = req.body;
  const file = req.file;

  if (!file) throw new ApiError(400, "Image file is required");

  if ([title, slug, content, status].some((f) => !f?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const imageUrl = `/temp/${file.filename}`; // Assuming multer saved in public/temp

  const newPost = new Posts({
    title,
    slug,
    content,
    featuredImage: imageUrl,
    status,
    userId: req.user._id,
    author: req.user._id,
  });

  const savedPost = await newPost.save();
  await savedPost.populate("author", "name email");

  res.status(201).json(new ApiResponse(true, "Post created", savedPost));
});

// get all published post
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Posts.find({ status: "published" }).sort({
    createAt: -1,
  });
  return res.status(200).json(new ApiResponse(true, "All Posts ", posts));
});

// get a single posts by slug (public routes)
const getPostBySlug = asyncHandler(async (req, res) => {
  const {slug} = req.params;
  const post = await Posts.findOne({ slug });
  if (!post) {
    throw new ApiError(400, "Post not found");
  }

  return res.status(200).json(new ApiResponse(true, "Post found", post));
});

const updatePost = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Not Authorize to edit the Post");

  const { slug } = req.params;
  const { title, content, featuredImage, status } = req.body;
  const post = await Posts.findOne({ slug });

  if (!post) throw new ApiError(404, "Post not found");

  // check ownership
  if (!post.userId.equals(req.user._id)) {
    throw new ApiError(401, "Not Authorize to edit the Post");
  }

  // update only provided field
  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (featuredImage !== undefined) post.featuredImage = featuredImage;
  if (status !== undefined) post.status = status;

  const updatedPost = await post.save();
  return res
    .status(200)
    .json(new ApiResponse(true, "Post updated successfully", updatedPost));
});

const deletePost = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "unauthorized to delete blogs");

  const { slug } = req.params;
  const post = await Posts.findOne({ slug });

  if (!post) throw new ApiError(404, "Post not found");

  if (!post.userId.equals(req.user._id)) {
    throw new ApiError(403, "Forbidden: Not your post");
  }

  await post.deleteOne();
  res.status(200).json({ message: "Post deleted successfully" });
});


const UPLOAD_DIR = path.join(process.cwd(), "public", "temp");

const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const uniqueId = uuidv4(); // Generate unique ID
  const ext = path.extname(req.file.originalname); // Get file extension
  const newFilename = uniqueId + ext;

  const oldPath = req.file.path;
  const newPath = path.join(UPLOAD_DIR, newFilename);

  // Rename/move the uploaded file to new name
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "File saving failed" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/public/temp/${newFilename}`;

    // Return file info
    res.status(201).json({
      success: true,
      message: "File uploaded",
      file: {
        $id: newFilename,
        url: fileUrl,
      },
    });
  });
};

const deleteFile = (req, res) => {
  const fileId = req.params.fileId;
  if (!fileId) {
    return res.status(400).json({ success: false, message: "FileId is required" });
  }

  const filePath = path.join(UPLOAD_DIR, fileId);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  // Delete file
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Failed to delete file" });
    }

    res.json({ success: true, message: "File deleted" });
  });
};
const getFilePreview = (req, res) => {
  const fileId = req.params.fileId;

  if (!fileId) {
    return res.status(400).json({ success: false, message: "FileId is required" });
  }

  const filePath = path.join(UPLOAD_DIR, fileId);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  res.sendFile(filePath);
};




export { 
    createPost, 
    getAllPosts, 
    getPostBySlug, 
    updatePost, 
    deletePost,
    uploadFile,
    deleteFile, 
    getFilePreview
};


// TODO: upload file on cloudinary from local