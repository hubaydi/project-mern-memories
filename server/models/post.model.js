import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    name: { type: String, required: true },
    creator: String,
    tags: [String],
    selectedFile: { type: String, required: true },
    likes: { type: [String], default: [] },
    comments: { type: [String], default: [] },
    createdAt: {
        type: Date,
        default: new Date(),
    },
}, {
    timestamps: true,
    strictQuery: false
});

const Post = mongoose.model('Post', postSchema);

export default Post;