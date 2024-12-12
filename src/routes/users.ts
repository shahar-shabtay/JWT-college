import express from 'express';
const router = express.Router();
import userController from '../controllers/users';
import authMiddleware from '../common/auth_middleware';

// Add a new user
router.post('/', authMiddleware, userController.post.bind(userController));

// Get all users
router.get('/', authMiddleware, userController.getAll.bind(userController));

// Get a user by id
router.get("/:id", authMiddleware, userController.get.bind(userController));

// Update user data by id
router.put('/:id', authMiddleware, userController.update.bind(userController));

// Delete user by ID
router.delete("/:id", authMiddleware, userController.delete.bind(userController));

export = router;