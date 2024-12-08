import express from 'express';
const router = express.Router();
import userController from '../controllers/users';

// Add a new user
router.post('/', userController.post.bind(userController));

// Get all users
router.get('/', userController.getAll.bind(userController));

// Get a user by id
router.get("/:id", userController.get.bind(userController));

// Update user data by id
router.put('/:id', userController.update.bind(userController));

// Delete user by ID
router.delete("/:id", userController.delete.bind(userController));

export = router;