import express from 'express';
const router = express.Router();
import { userController } from '../controllers/users';

// Add a new user
router.post('/', userController.addUser);

// Get all users
router.get('/', userController.getAllusers);

// Get a user by id
router.get("/:id", userController.getuserById);

// Update user data by id
router.put('/:id', userController.updateUser);

// Delete user by ID
router.delete("/:id", userController.deleteUserByID);

export = router;