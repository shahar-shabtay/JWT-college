const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts');

router.post('/', postController.addPost);
router.get('/', postController.getAllPosts);

// Get a post by id
router.get("/:id", postController.getPostById);

module.exports = router;