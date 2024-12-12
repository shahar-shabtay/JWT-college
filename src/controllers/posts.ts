import { Request, Response } from 'express';
import Post, { IPost } from '../models/posts';
import { BaseController } from './baseController';

class postController extends BaseController<IPost> {
    constructor() {
        super(Post);
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

export default new postController;
export { getPostsByOwner };