import express from 'express';
const router = express.Router();
import  postController , { getPostsByOwner, likePost } from '../controllers/posts';
//unlikePost
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

//Add a new post
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Add a new post
 *     tags:
 *       - Posts
 *     description: Endpoint to create a new post by providing necessary details in the request body.
 *     security:
 *       - bearerAuth: []
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
 * /posts/getAll:
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

//Get post by ID
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags:
 *       - Posts
 *     description: Retrieve a specific post using its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to retrieve.
 *         schema:
 *           type: string
 *           example: "62f99f3b3f2b2e4567a12345"
 *     responses:
 *       200:
 *         description: A single post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error.
 */

//Get post by owner
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get posts by owner
 *     tags:
 *       - Posts
 *     description: Retrieve a list of posts created by a specific owner.
 *     parameters:
 *       - name: ownerId
 *         in: query
 *         required: true
 *         description: The ID of the owner whose posts are to be retrieved.
 *         schema:
 *           type: string
 *           example: "62f99f3b3f2b2e4567a12345"
 *     responses:
 *       200:
 *         description: A list of posts by the specified owner
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request. Missing or invalid ownerId.
 *       404:
 *         description: No posts found for the specified owner.
 *       500:
 *         description: Internal server error.
 */

//Update a post by ID
/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags:
 *       - Posts
 *     description: Endpoint to update an existing post by providing the post ID and the updated details in the request body.
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       201:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request. Missing or invalid data.
 *       500:
 *         description: Internal server error.
 */

//Delete a post by ID
/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */

// Define routes for liking and unliking posts
// Like a post
router.put('/:id/like', likePost);
// router.get('/likes', postController.getLikes);

// Unlike a post
// router.put('/:id/unlike', authMiddleware, unlikePost);

export = router;