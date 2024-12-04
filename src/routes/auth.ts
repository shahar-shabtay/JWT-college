import { Router } from 'express';
import { registerUser, loginUser, logoutUser, refreshToken } from '../controllers/authController';

const router = Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

// Logout a user
router.post('/logout', logoutUser);

// Refresh token
router.post('/refresh-token', refreshToken);

export default router;
