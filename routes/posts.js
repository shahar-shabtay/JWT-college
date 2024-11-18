const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts');

router.post('/', postController.addPost);
router.get('/', postController.getAllPosts);

// Get a post by id
router.get("/:id", postController.getPostById);

// Update post data by id
router.put('/:id', postController.updatePost);


module.exports = router;