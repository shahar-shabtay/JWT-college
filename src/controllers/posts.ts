import { Request, Response } from 'express';
import Post, { IPost } from '../models/posts';
import createController from './baseController';

const postController = createController<IPost>(Post);


const getPostsBySender = async (req: Request, res: Response) => {
    try {
        const senderId = req.query.sender;  // Get the sender ID from query params

        if (!senderId) {
            return res.status(400).json({ error: 'Sender ID is required' });  // Return an error if sender ID is missing
        }

        // Find posts by sender ID and populate sender details
        const posts = await Post.find({ sender: senderId }).populate('sender', 'name email');

        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this sender' });  // No posts found for this sender
        }

        // Return posts as JSON
        res.status(200).json(posts);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });  // Handle server errors
    }
};

export default postController;
export { getPostsBySender };