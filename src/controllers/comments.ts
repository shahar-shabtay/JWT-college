import Comment, { IComment } from '../models/comments';
import createController from './baseController';
import { Request, Response } from 'express';


const commentController = createController<IComment>(Comment);
const getCommentByPostID = async (req: Request, res: Response) => {
    try {
        const postID = req.params.postID; // Get the post ID from URL params

        if (!postID) {
            return res.status(400).json({ error: 'Post ID is required' }); // Return an error if post ID is missing
        }

        // Find comments by post ID
        const comments = await Comment.find({ postID }).populate('commenter', 'name email'); // Adjust populate fields if needed

        if (comments.length === 0) {
            return res.status(201).json([]);
        }

        // Return comments as JSON
        res.status(200).json(comments);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' }); // Handle server errors
    }
};


export default commentController;
export {getCommentByPostID};