const Post = require('../models/posts');

// Add a New Post
const addPost = async (req, res) => {
    try {
        const { title, content, sender } = req.body;
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


module.exports = {
    addPost,
    getAllPosts
}
