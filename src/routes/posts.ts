import express from 'express';
const router = express.Router();
import  postController , { getPostsByOwner } from '../controllers/posts';
import authMiddleware from '../common/auth_middleware';

// Add a new post
router.post('/',authMiddleware, postController.post.bind(postController));

// Get all posts
router.get('/', postController.getAll.bind(postController));

// Get a post by id
router.get("/:id", postController.get.bind(postController));

// Get Posts by Owner
router.get('/posts', getPostsByOwner);

// Update post data by id
router.put('/:id', authMiddleware, postController.update.bind(postController));

// Delete post by ID
router.delete("/:id", authMiddleware, postController.delete.bind(postController));

/**
* @swagger
* tags:
*   name: Posts
*   description: The Post API
*/

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Add a new post
 *     tags:
 *       - Posts
 *     description: Endpoint to create a new post by providing necessary details in the request body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post.
 *                 example: "My first post"
 *               content:
 *                 type: string
 *                 description: The content of the post.
 *                 example: "This is the body of the post."
 *               sender:
 *                 type: string
 *                 description: The ID of the sender creating the post.
 *                 example: "62f99f3b3f2b2e4567a12345"
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request. Missing or invalid data.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Add a new post
 *     tags:
 *       - Posts
 *     description: Endpoint to create a new post by providing necessary details in the request body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post.
 *                 example: "My first post"
 *               content:
 *                 type: string
 *                 description: The content of the post.
 *                 example: "This is the body of the post."
 *               sender:
 *                 type: string
 *                 description: The ID of the sender creating the post.
 *                 example: "62f99f3b3f2b2e4567a12345"
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request. Missing or invalid data.
 *       500:
 *         description: Internal server error.
 */

// Get all posts
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags:
 *       - Posts
 *     description: Retrieve a list of all posts available in the system.
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error.
 */

export = router;