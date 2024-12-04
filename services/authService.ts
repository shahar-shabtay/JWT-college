import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/users';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwtUtils';

export async function register(data: { email: string; password: string; username: string }) {
    const { email, password, username } = data;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('User already exists');

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user
    const newUser = new User({ email, password: hashedPassword, username });
    await newUser.save();

    return { id: newUser.id, email: newUser.email, username: newUser.username };
}

export async function login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid email or password');

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return { accessToken, refreshToken };
}

export async function refreshAccessToken(refreshToken: string) {
    const userId = verifyRefreshToken(refreshToken);
    if (!userId) throw new Error('Invalid refresh token');

    return generateAccessToken(userId);
}
