import mongoose from 'mongoose';

// Interface for TypeScript typing
export interface IComment extends Document {
    commenter: string;
    postID: string;
    content: string;
}

const commentSchema = new mongoose.Schema({
    commenter: { type: String, required: true },
    postID: { type: String, required: true },
    content: { type: String, required: true },
});

export default mongoose.model<IComment>("Comment", commentSchema);
