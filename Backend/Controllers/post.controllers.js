import { Posts } from "../model/post.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createPost = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { title, subTitle, slug, content, status, category } = req.body;

  console.log("Body", req.body);
  if ([title, subTitle, slug, content, status, category].some((f) => !f?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  

  const featuredImagePath = req.file?.path;
  if (!featuredImagePath) {
    throw new ApiError(400, "Featured image is required");
  }

  const cloudinaryImage = await uploadOnCloudinary(featuredImagePath);
  if (!cloudinaryImage?.url) {
    throw new ApiError(500, "Image upload failed");
  }

  // console.log(cloudinaryImage);

  const newPost = await Posts.create({
    title,
    subTitle,
    content,
    status,
    slug,
    category,
    featuredImage: cloudinaryImage.url,
    userId: req.user._id,
    author: req.user._id,
  });

  await newPost.populate("author", "name email");
  console.log(newPost);
  

  res.status(201).json(new ApiResponse(true, "Post created", newPost));
});

// get all published post
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Posts.find({ status: "published" }).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(true, posts, "All Posts") // ✅ here: "posts" as 3rd arg
  );
});


// get a single posts by slug (public routes)
const getPostBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
const post = await Posts.findOne({ slug }).populate("userId", "name email");
  if (!post) {
    throw new ApiError(400, "Post not found");
  }

return res.status(200).json(new ApiResponse(true, post, "Post found"));
});

const updatePost = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Not authorized to edit the post");

  const { slug } = req.params;
  const { title, content, status } = req.body;
  const post = await Posts.findOne({ slug });

  if (!post) throw new ApiError(404, "Post not found");

  // Check ownership
  if (!post.userId.equals(req.user._id)) {
    throw new ApiError(401, "Not authorized to edit the post");
  }

  // Handle image upload
  const featuredImagePath = req.file?.path;  // <-- here
  // console.log("featuredImagePath:", featuredImagePath);
  // console.log("req.file:", req.file);

  if (featuredImagePath) {
    const cloudinaryImage = await uploadOnCloudinary(featuredImagePath);
    if (!cloudinaryImage?.url) {
      throw new ApiError(500, "Image upload failed");
    }
    post.featuredImage = cloudinaryImage.url;
  }

  // Update only provided fields
  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
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
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
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
      return res
        .status(500)
        .json({ success: false, message: "File saving failed" });
    }

    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/public/temp/${newFilename}`;

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
    return res
      .status(400)
      .json({ success: false, message: "FileId is required" });
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
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete file" });
    }

    res.json({ success: true, message: "File deleted" });
  });
};

const getFilePreview = (req, res) => {
  const fileId = req.params.fileId;

  if (!fileId) {
    return res
      .status(400)
      .json({ success: false, message: "FileId is required" });
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
  getFilePreview,
};

// TODO: upload file on cloudinary from local
