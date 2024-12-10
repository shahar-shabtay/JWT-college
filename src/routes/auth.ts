import { Router } from 'express';
import { registerUser, loginUser, logoutUser, refreshToken } from '../controllers/authController';

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: The Authentication API
 */

const router = Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

// Logout a user
router.post('/logout', logoutUser);

// Refresh token
router.post('/refresh-token', refreshToken);

export = router;