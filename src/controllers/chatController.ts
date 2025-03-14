import { OpenAI, RateLimitError } from 'openai';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();
const baseURL = "https://api.aimlapi.com/v1";
const systemPrompt = "You are an assistant in a dog adoption center. answer short answers";
const apiKey = process.env.AI_API_KEY;

const api = new OpenAI({
    apiKey,
    baseURL,
  });

// Send a question to chatGPT
async function askChatGPT(req: Request, res: Response) {
    const question = req.body.question;
  
    if (!question) {
      return res.status(400).json({ error: 'Missing question in request body' });
    }
  
    try {
      const completion = await api.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: question,
          },
        ],
        temperature: 0.7,
        max_tokens: 256,
      });
  
      const response = completion.choices[0].message.content;
      res.status(200).send({ answer: response });

    } catch (error) {
        // console.log(error);

      // Check if the error is that we are out of tokens
      if (error instanceof RateLimitError) {
        res.status(429).json({ error: 'Rate limit exceeded. Please wait and try again later.' });
      } else {
          console.log(error);
          // If it's another error, handle it normally
          res.status(500).json({ error: 'An error occurred while processing your request.' });
      }
  
    }
  }  

export { askChatGPT };
