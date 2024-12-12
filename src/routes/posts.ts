import express from 'express';
const router = express.Router();
import  postController , { getPostsByOwner } from '../controllers/posts';
import authMiddleware from '../common/auth_middleware';

// Add a new post
router.post('/',authMiddleware, postController.post.bind(postController));

// Get all posts
router.get('/', postController.getAll.bind(postController));

// Get a post by id
router.get("/:id", postController.get.bind(postController));

// Get Posts by Owner
router.get('/posts', getPostsByOwner);

// Update post data by id
router.put('/:id', authMiddleware, postController.update.bind(postController));

// Delete post by ID
router.delete("/:id", authMiddleware, postController.delete.bind(postController));


export = router;