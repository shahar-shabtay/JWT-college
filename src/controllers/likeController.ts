import { Request, Response } from "express";
import likesModel from "../models/likes";
import postModel from "../models/posts";
import userModel from "../models/users";

// Create Like
const createLike = async (req: Request, res: Response) => {
    const postId = req.body.postId;
    const userId = req['user']._id
    console.log(postId, userId);

    // Validate Post and User
    const isValid = await validateLike(postId, userId);
    if (!isValid) {
        res.status(400).send({ message: "Unauthorized or Invalid Data" });
        return;
    }

    try {
        const likeObject = await likesModel.create({
            owner: userId,
            postId: postId
        });
        // Increment likesCount in Post
        await postModel.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

        res.status(201).send(likeObject);
    } catch (err) {
        res.status(400).send({ message: "Error creating like", error: err });
    }
}

// Delete Like
const deleteLike = async (req: Request, res: Response) => {
    const postId = req.params.postId;
    const userId = req['user']._id;

    // Validate Post and User
    const isValid = await validateLike(postId, userId);
    if (!isValid) {
        res.status(400).send({ message: "Unauthorized or Invalid Data" });
        return;
    }

    try {
        const deletedLikeObject = await likesModel.findOneAndDelete({ postId: postId, owner: userId });
        if (!deletedLikeObject) {
            res.status(404).send({ message: "Like not found or unauthorized" });
            return;
        }

        // Decrement likesCount in Post
        await postModel.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });

        res.status(200).send({ message: "Like deleted successfully" });
    } catch (err) {
        res.status(400).send({ message: "Error deleting like", error: err });
    }
}

// Get Like by Owner (Check if User Liked a Post)
const getLikeByOwner = async (req: Request, res: Response) => {
    const { userId, postId } = req.params;

    try {
        const like = await likesModel.findOne({ owner: userId, postId: postId });

        if (like) {
            res.status(200).send({ liked: true });
        } else {
            res.status(200).send({ liked: false });
        }
    } catch (err) {
        res.status(500).send({ message: "Error checking like status", error: err });
    }
};


// Validate if Post and User Exist
const validateLike = async (postId: string, userId: string): Promise<boolean> => {
    try {
        const post = await postModel.findById(postId);
        const user = await userModel.findById(userId);

        return !!post && !!user;
    } catch {
        return false;
    }
};

const getLikesByPostID = async (req: Request, res: Response) => {
    try {
        const postID = req.params.postID; // Get the post ID from URL params

        if (!postID) {
            return res.status(400).json({ error: 'Post ID is required' }); // Return an error if post ID is missing
        }

        // Find comments by post ID
        const likes = await postModel.findById(postID).select('likes'); 

        // Return comments as JSON
        console.log(likes);
        res.status(200).json(likes);
        

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' }); // Handle server errors
    }
};

export default { createLike, deleteLike, getLikeByOwner, getLikesByPostID };
