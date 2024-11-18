const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts');

router.post('/', postController.addPost);
router.get('/', postController.getAllPosts);

module.exports = router;