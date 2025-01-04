import mongoose from 'mongoose';

// Interface for TypeScript typing
export interface IPost extends Document {
    title: string;
    content: string;
    owner: mongoose.Schema.Types.ObjectId;
    likes: mongoose.Types.ObjectId[]; 
    // likes: mongoose.Types.Array<mongoose.Schema.Types.ObjectId>;
    // owner: mongoose.Schema.Types.ObjectId;

}

const postSchema = new mongoose.Schema<IPost>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Links to a User
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs
    }, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` fields

export default mongoose.model<IPost>("Post", postSchema);