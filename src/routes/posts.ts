import express from 'express';
const router = express.Router();
import  postController , { getPostsBySender } from '../controllers/posts';

// Add a new post
router.post('/',postController.post.bind(postController));

// Get all posts
router.get('/', postController.getAll.bind(postController));

// Get a post by id
router.get("/:id", postController.get.bind(postController));

// Get Posts by Sender
router.get('/posts', getPostsBySender);

// Update post data by id
router.put('/:id', postController.update.bind(postController));

// Delete post by ID
router.delete("/:id", postController.delete.bind(postController));


export = router;