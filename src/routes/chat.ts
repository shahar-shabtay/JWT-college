import { Router } from 'express';
import { askChatGPT } from '../controllers/chatController';

/**
* @swagger
* tags:
*   name: Chat
*   description: Using the chatGPT API
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
*         - question
*       properties:
*         question:
*           type: string
*           description: The content of the question
*       example:
*         question: 'What is the best dog type for a small home?'
*/

const router = Router();

/**
 * @swagger
 * /Chat:
 *   post:
 *     summary: Send ChatGPT a question
 *     tags: 
 *       - Chat
 *     description: need to provide a question in the request body
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

// Ask a new question to chatGPT
router.post('/', askChatGPT);

export = router;