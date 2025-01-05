import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();
const baseURL = "https://api.aimlapi.com/v1";
const systemPrompt = "You are an assistant in a dog adoption center.";
const apiKey = process.env.AI_API_KEY;

// Create an instance of the OpenAI API
// const openai = new OpenAI({
//     apiKey: process.env.AI_API_KEY,
//     dangerouslyAllowBrowser: false,
// });

const api = new OpenAI({
    apiKey,
    baseURL,
  });

// Send a question to chatGPT
async function askChatGPT (req: Request, res: Response) {
    const question = req.body.question;

    if (!question) {
      return res.status(400).json({ error: 'Missing question in request body' });
    }
  
    const completion = await api.chat.completions.create({
        model: "mistralai/Mistral-7B-Instruct-v0.2",
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
    
      console.log("User:", question);
      console.log("AI:", response);


    // try {
    //   const response = await openai.chat.completions.create({
    //     model: "gpt-4o-mini",
    //     messages: [
    //       { role: "system", content: "You are a helpful assistant." },
    //       { role: "user", content: question },
    //     ],
    //     max_tokens: 150,
    //   });
  
    //   res.json({ answer: response.choices[0].message?.content });
    // } catch (error) {
    //   console.error("error:", error);
    //   res.status(500).json({ error: 'Internal Server Error' });
    // }
}

export { askChatGPT };
