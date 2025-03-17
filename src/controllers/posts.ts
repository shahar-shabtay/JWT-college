import { Request, Response } from 'express';
import Post, { IPost } from '../models/posts';
import { BaseController } from './baseController';
import { Model } from "mongoose";

class postController extends BaseController<IPost> {
    constructor(model: Model<IPost>) {
        super(model);
    }

    // Create new object
    async post (req: Request, res: Response) {
        const userId = req['user']._id;
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

// Get All Posts with Pagination
const getAllWithPaging = async (req: Request, res: Response) => {
    try {
        // Ensure page and limit are valid numbers
        const pageNum = Number(req.query.page) || 1;
        const limitNum = Number(req.query.limit) || 10;

        if (pageNum < 1 || limitNum < 1) {
            return res.status(400).json({ message: "Page and limit must be positive numbers." });
        }

        const posts = await Post
            .find()
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        const totalCount = await Post.countDocuments();

        res.json({
            data: posts,
            totalPages: Math.ceil(totalCount / limitNum),
            currentPage: pageNum,
            totalItems: totalCount,
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error" });
    }
}  



export default new postController(Post);
export { getPostsByOwner, getAllWithPaging};