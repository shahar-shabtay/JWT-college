const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts');

// Add a new post
router.post('/', postController.addPost);

// Get all posts
router.get('/', postController.getAllPosts);

// Get a post by id
router.get("/:id", postController.getPostById);

// Get Posts by Sender
router.get('/posts', postController.getPostsBySender);

// Update post data by id
router.put('/:id', postController.updatePost);


module.exports = router;