const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Route to add a new post
router.post('/', postController.addPost);

module.exports = router;