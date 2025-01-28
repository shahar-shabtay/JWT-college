import mongoose from 'mongoose';

// Interface for TypeScript typing
export interface IPost extends Document {
    title: string;
    content: string;
    owner: mongoose.Schema.Types.ObjectId;
    // usersWhoLiked: mongoose.Schema.Types.ObjectId[]; // Array to store IDs of users
    usersWhoLiked: string[];
}

// Define the schema
const postSchema = new mongoose.Schema<IPost>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Links to a User
        usersWhoLiked: [{ type: String }], // Array of usernames

    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

export default mongoose.model<IPost>("Post", postSchema);