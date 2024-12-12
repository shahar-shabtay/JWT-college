import mongoose from 'mongoose';

// Define the IUser interface
export interface IUser {
    email: string;
    username: string;
    password: string;
    _Id?: string;
}

// Define the schema
const userSchema = new mongoose.Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Export the model
export default mongoose.model<IUser>("User", userSchema);