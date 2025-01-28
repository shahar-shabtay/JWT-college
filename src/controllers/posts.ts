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
// // Utility function to extract user ID from the Authorization token
// const getUserIdFromToken = (req: Request): string | null => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//         console.error('Authorization header is missing');
//         return null;
//     }

//     if (!authHeader.startsWith('Bearer ')) {
//         console.error('Authorization header format is invalid');
//         return null;
//     }

//     const token = authHeader.split(' ')[1];

//     if (!token) {
//         console.error('Token is missing');
//         return null;
//     }

//     try {
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '');
//         if (typeof decodedToken === 'object' && 'id' in decodedToken) {
//             return (decodedToken as { id: string }).id;
//         } else {
//             console.error('Decoded token does not contain an ID');
//             return null;
//         }
//     } catch (error) {
//         console.error('Token verification failed:', error);
//         return null;
//     }
// };

// Like a post
  const likePost = async (req: Request, res: Response) => {
    try {
      const postId  = req.params.id;
      const userName  = req.body.userName;
      console.log("this is username", userName)
      console.log("this is postID", postId)
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const alreadyLiked = post.usersWhoLiked.includes(userName);
      if (alreadyLiked) {
        post.usersWhoLiked = post.usersWhoLiked.filter((name) => name !== userName);
      } else {
        post.usersWhoLiked.push(userName);
      }
  
      await post.save();
      return res.status(200).json({ message: 'Post updated', usersWhoLiked: post.usersWhoLiked });
    } catch (error) {
      console.error('Error in likePost:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
  
// // Unlike a post
// export const unlikePost = async (req: Request, res: Response) => {
//     const { id: postId } = req.params; // Post ID from URL parameters
//     const { userName } = req.body; // Username from the request body

//     if (!userName) {
//         return res.status(400).json({ message: 'Username is required to unlike a post' });
//     }

//     try {
//         const post = await Post.findById(postId);
//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }

//         if (!post.usersWhoLiked.includes(userName)) {
//             return res.status(400).json({ message: 'You have not liked this post' });
//         }

//         post.usersWhoLiked = post.usersWhoLiked.filter((like) => like !== userName); // Remove the username
//         await post.save();

//         res.status(200).json({ message: 'Post unliked successfully', post });
//     } catch (err) {
//         console.error('Error unliking post:', err);
//         res.status(500).json({ message: 'An error occurred while unliking the post' });
//     }
// };



export default new postController(Post);
export { getPostsByOwner };
export {likePost};