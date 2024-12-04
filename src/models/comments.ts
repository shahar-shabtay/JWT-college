import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    commenter: { type: String, required: true },
    postID: { type: String, required: true },
    content: { type: String, required: true },
});

export default mongoose.model("Comment", commentSchema);