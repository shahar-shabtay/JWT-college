import mongoose, { Schema, Document } from 'mongoose';

// Interface for TypeScript typing
export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
}

// Define the schema
const userSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Export the model
export default mongoose.model("user", userSchema);