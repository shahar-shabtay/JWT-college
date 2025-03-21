import express from 'express';
const router = express.Router();
import commentController, { getCommentByPostID } from '../controllers/comments';

/**
* @swagger
* tags:
*   name: Comments
*   description: The Comments API
*/


/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commenter:
 *                 type: string
 *                 description: The name or ID of the commenter
 *               postID:
 *                 type: string
 *                 description: The ID of the post associated with the comment
 *               content:
 *                 type: string
 *                 description: The content of the comment
 *             required:
 *               - commenter
 *               - postID
 *               - content
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 commenter:
 *                   type: string
 *                 postID:
 *                   type: string
 *                 content:
 *                   type: string
 *       500:
 *         description: Server error
 */
// Add a new comment
router.post('/', commentController.post.bind(commentController));

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: owner
 *         schema:
 *           type: string
 *         description: Filter comments by owner
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   commenter:
 *                     type: string
 *                   postID:
 *                     type: string
 *                   content:
 *                     type: string
 *       400:
 *         description: Bad request
 */
// Get all comments
router.get('/', commentController.getAll.bind(commentController));

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment
 *     responses:
 *       200:
 *         description: Comment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 commenter:
 *                   type: string
 *                 postID:
 *                   type: string
 *                 content:
 *                   type: string
 *       404:
 *         description: Comment not found
 */
// Get a comment by id
router.get("/:id", commentController.get.bind(commentController));

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated content for the comment
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 commenter:
 *                   type: string
 *                 postID:
 *                   type: string
 *                 content:
 *                   type: string
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
// Update comment data by id
router.put('/:id', commentController.update.bind(commentController));

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
// Delete Comment by ID
router.delete("/:id", commentController.delete.bind(commentController));

/**
 * @swagger
 * /comments/comment/{postID}:
 *   get:
 *     summary: Get comments by post ID
 *     tags: [Comments]
 *     parameters:
 *     - in: path
 *       name: postID
 *       required: true
 *     responses:
 *       200:
 *         description: List of comments
 */
// Get comments by post ID
router.get('/comment/:postID', getCommentByPostID); // Use getCommentByPostID explicitly
export = router;