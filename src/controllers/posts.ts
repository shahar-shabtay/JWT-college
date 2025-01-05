import { Request, Response } from 'express';
import Post, { IPost } from '../models/posts';
import { BaseController } from './baseController';
import { Model } from "mongoose";

class postController extends BaseController<IPost> {
    constructor(model: Model<IPost>) {
        super(model);
    }

      // Create new object
    async post(req: Request, res: Response) {
        const userId = req['user']._id; // Get the user ID from the request object
        const message = req.body;
        message.owner = userId;
        super.post(req, res);
    }

  // Increment likes for a post
  async likePost(req: Request, res: Response) {
    try {
      const { postId } = req.params; // Get the post ID from the route parameters

      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      // Find the post by ID and increment the likes field
      const updatedPost = await this.model.findByIdAndUpdate(
        postId,
        { $inc: { likes: 1 } }, // Increment likes by 1
        { new: true } // Return the updated document
      );

      if (!updatedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.status(200).json(updatedPost); // Return the updated post
    } catch (error) {
      console.error('Error liking the post:', error);
      res.status(500).json({ error: 'Failed to like the post' });
    }
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
        // Map over the posts and add the likes count to each post
        const postsWithLikesCount = posts.map((post) => ({
            ...post.toObject(),
            likesCount: post.likes.length // Add likesCount field
        }));

        // Return posts with likes count as JSON
        res.status(200).json(postsWithLikesCount);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });  // Handle server errors
    }
};

export default new postController(Post);
export { getPostsByOwner };