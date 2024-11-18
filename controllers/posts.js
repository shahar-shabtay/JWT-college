const Post = require('../models/posts');

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

module.exports = {
  addPost,
  getAllPosts,
  getPostById,
  updatePost
};
