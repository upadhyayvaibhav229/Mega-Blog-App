import mongoose, { Schema, model } from 'mongoose';

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    featuredImage: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
    },
}, { timestamps: true });

export const Posts = mongoose.model("POST", postSchema);