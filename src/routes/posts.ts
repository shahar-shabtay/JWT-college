import express from 'express';
const router = express.Router();
import  { postController } from '../controllers/posts';

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

// Delete post by ID
router.delete("/:id", postController.deletePostByID);


export = router;