import mongoose from 'mongoose';

// Interface for TypeScript typing
export interface IPost extends Document {
    title: string;
    content: string;
    owner: mongoose.Schema.Types.ObjectId;
    likesCount: number;
}

// Define the schema
const postSchema = new mongoose.Schema<IPost>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Links to a User
        likesCount: {type: Number,default: 0,},
    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

export default mongoose.model<IPost>("Post", postSchema);