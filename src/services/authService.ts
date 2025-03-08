import bcrypt from 'bcrypt';
import User from '../models/users';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwtUtils';
import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = '820021502901-rc6goqvsie6bhuh2f530gralprmjk7ll.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

interface GoogleUser {
  email: string;
  password: string;
  username: string;
//   TODO: when we have a profile picture
//   picture: string;
}

// Verify Google token and get user info
export const verifyGoogleToken = async (token: string): Promise<GoogleUser> => {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    // Make sure the user exists and get the user info
    const payload = ticket.getPayload();
    if (!payload) throw new Error('Invalid token');
  
    return {
        email: payload.email || '',
        password: payload.sub || '',
        username: payload.name || '',
        // TODO: when we have a profile picture
        // picture: payload.picture || '',
    };
};

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
    if (!user) throw new Error('Invalid email, user not found');

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Password is incorrect');

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return { accessToken, refreshToken };
}

export async function refreshAccessToken(refreshToken: string) {
    const userId = verifyRefreshToken(refreshToken);
    if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid refresh token');
    }

    return generateAccessToken(userId);
}

export async function ifUserExists(email: string) {
    const user = await User.findOne({ email });
    if (!user) return false;
    return true;
}