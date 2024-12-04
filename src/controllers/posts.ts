import { Request, Response } from 'express';
import Post from '../models/posts';

// Add a New Post
const addPost = async (req, res) => {
    try {
        const { title, content, sender } = req.body;

        // Create and save the post
        const post = new Post({ title, content, sender });
        await post.save();
        res.status(201).json(post); // Respond with the created post
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle server errors
    }
};

// Get All Posts
const getAllPosts = async (req, res) => {
  const filter = req.query.owner;
  try {
    if (filter) {
      const posts = await Post.find({ owner: filter });
      res.send(posts);
    } else {
      const posts = await Post.find();
      res.send(posts);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};


// Get post by ID
const getPostById = async (req, res) => {
    const postId = req.params.id;
    try {
      const post = await Post.findById(postId);
      if (post) {
        res.send(post);
      } else {
        res.status(404).send("Post not found");
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };


const getPostsBySender = async (req, res) => {
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


// Update post data
const updatePost = async (req, res) => {
  const postId = req.params.id;
  const postData = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'post not found' });
    }
    
    Object.assign(post, postData);
    
    await post.save();
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: 'Error updating post: ' + error.message });
  }
};

// Delete a post by ID
const deletePostByID = async (req: Request, res: Response): Promise<void> => {
  try {
    const postID = req.params.id; // Extract post ID from the URL

    // Find the post by ID and delete it
    const deletedPost = await Post.findByIdAndDelete(postID);

    if (!deletedPost) {
      res.status(404).json({ error: 'Post not found' }); // Handle case where post doesn't exist
      return;
    }

    // Return a success message
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' }); // Handle server errors
  }
};

export const postController = {
  addPost,
  getAllPosts,
  getPostById,
  updatePost,
  getPostsBySender,
  deletePostByID
};
