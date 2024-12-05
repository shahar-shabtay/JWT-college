import { Request, Response } from 'express';
import { register, login, refreshAccessToken } from '../services/authService';

// User registration
export async function registerUser(req: Request, res: Response): Promise<void> {
    try {
        const user = await register(req.body);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// User login
// Login route with debug prints
export async function loginUser(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;
        console.log("Login attempt:", { email, password }); // Debug print

        const tokens = await login(email, password);
        console.log("Generated tokens:", tokens); // Debug print

        res.status(200).json(tokens);
    } catch (error) {
        console.error("Login error:", error.message); // Debug print
        res.status(401).json({ error: error.message });
    }
}

// Logout user
export async function logoutUser(req: Request, res: Response): Promise<void> {
    // Logic to handle logout can include revoking refresh tokens if needed
    res.status(200).json({ message: 'Logout successful' });
}

// Refresh token
export async function refreshToken(req: Request, res: Response): Promise<void> {
    try {
        const { refreshToken } = req.body;
        const newAccessToken = await refreshAccessToken(refreshToken);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
}
