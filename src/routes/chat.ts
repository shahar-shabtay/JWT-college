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
* /auth/register:
*   post:
*     summary: send a question to chatGPT
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*     responses:
*       200:
*         description: The answer was generated successfully
*/

// Ask a new question to chatGPT
router.post('/', askChatGPT);

export = router;