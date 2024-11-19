const Comment = require('../models/comments');

// Add a New comment
const addComment = async (req, res) => {
    try {
        const { commenter, postID, content} = req.body;

        // Create and save the comment
        const comment = new Comment({ commenter, postID, content });
        await comment.save();
        res.status(201).json(comment); // Respond with the created comment
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle server errors
    }
};

// Get All comments
const getAllcomments = async (req, res) => {
  const filter = req.query.owner;
  try {
    if (filter) {
      const comments = await Comment.find({ owner: filter });
      res.send(comments);
    } else {
      const comments = await Comment.find();
      res.send(comments);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Get comment by ID
const getcommentById = async (req, res) => {
    const commentId = req.params.id;
    try {
      const comment = await Comment.findById(commentId);
      if (comment) {
        res.send(comment);
      } else {
        res.status(404).send("comment not found");
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };


// Update comment data
const updatecomment = async (req, res) => {
  const commentId = req.params.id;
  const commentData = req.body;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'comment not found' });
    }
    
    Object.assign(comment, commentData);
    
    await comment.save();
    return res.status(200).json(comment);
  } catch (error) {
    return res.status(500).json({ error: 'Error updating comment: ' + error.message });
  }
};

module.exports = {
  addComment,
  getAllcomments,
  getcommentById,
  updatecomment
};
