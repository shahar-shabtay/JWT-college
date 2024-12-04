import express from 'express';
const router = express.Router();
import { commentController } from '../controllers/comments';

// Add a new comment
router.post('/', commentController.addComment);

// Get all comments
router.get('/', commentController.getAllcomments);

// Get a comment by id
router.get("/:id", commentController.getcommentById);

// Update comment data by id
router.put('/:id', commentController.updateComment);

// Delete Comment by ID
router.delete("/:id", commentController.deleteCommentByID);

export = router;