import { Router } from 'express';
import { registerUser, loginUser, logoutUser, refreshToken , googleAuth } from '../controllers/authController';

/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - email
*         - password
*       properties:
*         email:
*           type: string
*           description: The user email
*         password:
*           type: string
*           description: The user password
*       example:
*         email: 'bob@gmail.com'
*         password: '123456'
*/
const router = Router();

/**
* @swagger
* /auth/register:
*   post:
*     summary: registers a new user
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The new user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/

// Register a new user
router.post('/register', registerUser);

/**
* @swagger
* /auth/login:
*   post:
*     summary: Login with user
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The acess & refresh tokens
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Tokens'
*/

/**
* @swagger
* components:
*   schemas:
*     Tokens:
*       type: object
*       required:
*         - accessToken
*         - refreshToken
*       properties:
*         accessToken:
*           type: string
*           description: The JWT access token
*         refreshToken:
*           type: string
*           description: The JWT refresh token
*       example:
*         accessToken: '123cd123x1xx1'
*         refreshToken: '134r2134cr1x3c'
*/

// Login a user
router.post('/login', loginUser);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: 
 *       - Auth
 *     description: Need to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout completed successfully
 */

// Logout a user
router.post('/logout', logoutUser);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Register a user using Google
 *     tags: 
 *       - Auth
 *     description: Need to provide the google token in the body
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Login completed successfully
 */

// Google Auth
router.post('/google', googleAuth);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Get a new access token using the refresh token
 *     tags: 
 *       - Auth
 *     description: Need to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 */

// Refresh token
router.post('/refresh-token', refreshToken);

export = router;