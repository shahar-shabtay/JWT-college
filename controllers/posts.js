const Post = require('../models/posts');

// Add a New Post
exports.addPost = async (req, res) => {
    try {
        const { title, content, sender } = req.body;

        // // Validate required fields
        // if (!title || !content || !sender) {
        //     return res.status(400).json({ message: 'Title, content, and sender are required.' });
        // }

        // Create and save the post
        const post = new Post({ title, content, sender });
        await post.save();

        res.status(201).json(post); // Respond with the created post
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle server errors
    }
};
