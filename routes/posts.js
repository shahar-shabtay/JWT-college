const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts');

// Route to add a new post
router.post('/', postController.addPost);

// Get a post by id
router.get("/:id", postController.getPostById);

module.exports = router;