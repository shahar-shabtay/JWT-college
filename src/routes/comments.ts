import express from 'express';
const router = express.Router();
import commentController from '../controllers/comments';

// Add a new comment
router.post('/', commentController.post.bind(commentController));

// Get all comments
router.get('/', commentController.getAll.bind(commentController));

// Get a comment by id
router.get("/:id", commentController.get.bind(commentController));

// Update comment data by id
router.put('/:id', commentController.update.bind(commentController));

// Delete Comment by ID
router.delete("/:id", commentController.delete.bind(commentController));

export = router;