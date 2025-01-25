import { Request, Response } from 'express';
import Post, { IPost } from '../models/posts';
import { BaseController } from './baseController';
import mongoose, { Model } from 'mongoose';
import jwt from 'jsonwebtoken';

class postController extends BaseController<IPost> {
    constructor(model: Model<IPost>) {
        super(model);
    }

    // Create new object
    async post (req: Request, res: Response) {
        const userId = req['user']._id;  // Get the user ID from the request object
        const message = req.body;
        message.owner = userId
        super.post(req, res);
    }

}

const getPostsByOwner = async (req: Request, res: Response) => {
    try {
        const ownerId = req.query.owner;  // Get the owner ID from query params

        if (!ownerId) {
            return res.status(400).json({ error: 'Owner ID is required' });  // Return an error if owner ID is missing
        }

        // Find posts by owner ID and populate owner details
        const posts = await Post.find({ owner: ownerId }).populate('owner', 'name email');

        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this owner' });  // No posts found for this owner
        }

        // Return posts as JSON
        res.status(200).json(posts);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });  // Handle server errors
    }
};
// Utility function to extract user ID from the Authorization token
const getUserIdFromToken = (req: Request): string | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('JWT ')) return null;

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        return (decoded as { id: string }).id;
    } catch {
        return null;
    }
};

// Like a post
export const likePost = async (req: Request, res: Response) => {
    const postId = req.params.id;
    const userId = getUserIdFromToken(req);

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or missing token' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Convert userId to ObjectId using Schema.Types.ObjectId
        const userIdObject = new mongoose.Schema.Types.ObjectId(userId);

        if (post.usersWhoLiked.some((id) => id.toString() === userIdObject.toString())) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }

        post.usersWhoLiked.push(userIdObject); // Push the ObjectId
        await post.save();

        res.status(200).json({ message: 'Post liked successfully', post });
    } catch (err) {
        console.error('Error liking post:', err);
        res.status(500).json({ message: 'An error occurred while liking the post' });
    }
};

// Unlike a post
export const unlikePost = async (req: Request, res: Response) => {
    const postId = req.params.id;
    const userId = getUserIdFromToken(req);

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or missing token' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Convert userId to ObjectId using Schema.Types.ObjectId
        const userIdObject = new mongoose.Schema.Types.ObjectId(userId);

        if (!post.usersWhoLiked.some((id) => id.toString() === userIdObject.toString())) {
            return res.status(400).json({ message: 'You have not liked this post' });
        }

        post.usersWhoLiked = post.usersWhoLiked.filter(
            (id) => id.toString() !== userIdObject.toString()
        );
        await post.save();

        res.status(200).json({ message: 'Post unliked successfully', post });
    } catch (err) {
        console.error('Error unliking post:', err);
        res.status(500).json({ message: 'An error occurred while unliking the post' });
    }
};


export default new postController(Post);
export { getPostsByOwner };