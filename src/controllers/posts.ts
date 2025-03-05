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

  const getLikes = async (req, res) => {
    try {
        const postId = req.params.postId; // Get the postId from the URL parameters
        const userName = req.body.userName;
        
        // Fetch the specific post by its ID and retrieve only the 'likes' field
        const post = await Post.findById(postId, 'likes');
        console.log("This is postID-", postId);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user has already liked the post
        const userHasLiked = post.usersWhoLiked.includes(userName);

        res.json({ 
            likes: post.likes, 
            userHasLiked // Send back if user liked the post
        });

        // Return the likes for the specific post
        res.json({ likes: post.likes });
    } catch (error) {
        console.error('Error fetching likes:', error);
        res.status(500).json({ message: 'Server error fetching likes' });
    }
  };


// Like a post
  const likePost = async (req: Request, res: Response) => {
    try {
      const postId  = req.params.id;
      const userName  = req.body.userName;
      console.log("this is username", userName)
      console.log("this is postID", postId)

      if (!userName) {
        return res.status(400).json({ message: 'UserName is required' });
      }
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
        // Remove null values from usersWhoLiked
        post.usersWhoLiked = post.usersWhoLiked.filter(Boolean);

        // Handle adding or removing the username
        const alreadyLiked = post.usersWhoLiked.includes(userName);
        if (alreadyLiked) {
            post.usersWhoLiked = post.usersWhoLiked.filter((name) => name !== userName);
            post.likes -= 1; // Decrement the likes count
        } else {
            post.usersWhoLiked.push(userName);
            post.likes += 1; // Increment the likes count
        }

        // Save the document
        await post.save({ validateModifiedOnly: true });

        return res.status(200).json({ message: 'Post updated', usersWhoLiked: post.usersWhoLiked });
    } catch (error) {
        console.error('Error in likePost:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
  const unlikePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        const userName = req.body.userName;

        console.log("this is username to unlike", userName);
        console.log("this is postID to unlike", postId);

        if (!userName) {
            return res.status(400).json({ message: 'UserName is required' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!post.usersWhoLiked.includes(userName)) {
            return res.status(400).json({ message: 'You have not liked this post' });
        }

        // Remove the username
        post.usersWhoLiked = post.usersWhoLiked.filter((like) => like !== userName);
        post.likes -= 1; // Decrement the likes count
        // Save the document, validate only modified fields
        await post.save({ validateModifiedOnly: true });

        res.status(200).json({ message: 'Post unliked successfully', usersWhoLiked: post.usersWhoLiked });
    } catch (err) {
        console.error('Error unliking post:', err);
        res.status(500).json({ message: 'An error occurred while unliking the post', error: err.message });
    }
  };




export default new postController(Post);
export { getPostsByOwner };
export {likePost, unlikePost, getLikes};