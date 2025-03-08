import { Request, Response } from 'express';
import { register, login, refreshAccessToken, ifUserExists } from '../services/authService';
import { verifyGoogleToken } from '../services/authService';

// Auth with Google
export async function googleAuth (req: Request, res: Response): Promise<void> {
    try {
      const { credential } = req.body;
  
      if (!credential) {
        res.status(400).json({ message: 'Credential is required' });
        return;
      }
  
      const user = await verifyGoogleToken(credential);

      if(await ifUserExists(user.email)) {
        const tokens = await login(user.email, user.password);
        res.status(200).send(tokens);
      } else {
          const userRegister = await register(user);
          res.status(201).json({ message: 'google user registered:', userRegister });
        }
      
    } catch (error) {
      console.error('Auth Error:', error);
      res.status(400).json({ message: 'Invalid token' });
    }
  };

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
export async function loginUser(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;

        const tokens = await login(email, password);

        res.status(200).send(tokens);
    } catch (error) {
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
        const refreshToken = req.body.token;
        const newAccessToken = await refreshAccessToken(refreshToken);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
}
