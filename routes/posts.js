const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts');

// Route to add a new post
router.post('/', postController.addPost);

// Get a post by id
router.get("/:id", postController.getPostById);

// Update post data by id
router.put('/:id', postController.updatePost);


module.exports = router;