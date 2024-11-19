const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comments');

// Add a new comment
router.post('/', commentController.addComment);

// Get all comments
router.get('/', commentController.getAllcomments);

// Get a comment by id
router.get("/:id", commentController.getcommentById);

// Update comment data by id
router.put('/:id', commentController.updatecomment);


module.exports = router;