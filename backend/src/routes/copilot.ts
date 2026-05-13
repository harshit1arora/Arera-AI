import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { enforceQuota } from '../middleware/quota';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

router.post('/', enforceQuota, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { prompt, borrowerData, conversationHistory } = req.body;

    if (!prompt || !borrowerData) {
      return res.status(400).json({ error: 'Missing prompt or borrowerData' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format the history for Gemini (if conversationHistory exists)
    const formattedHistory = conversationHistory ? conversationHistory.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })) : [];

    // System context to ensure it behaves as an Underwriting Copilot
    const systemInstruction = `You are AreraBot, an expert AI Underwriting Analyst Copilot built into the Arera AI platform. 
    You are assisting a Credit Manager in evaluating a complex loan application. 
    Be highly professional, analytical, concise, and deterministic. Avoid fluff. 
    You have access to the following borrower data:
    ${JSON.stringify(borrowerData, null, 2)}
    
    Answer the Credit Manager's question accurately based on the data provided.`;

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemInstruction }] },
        { role: 'model', parts: [{ text: 'Understood. I am AreraBot, ready to assist.' }] },
        ...formattedHistory
      ],
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.2, // Low temperature for deterministic/factual responses
      }
    });

    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();

    res.json({ reply: responseText });
  } catch (error) {
    console.error('Copilot Error:', error);
    res.status(500).json({ error: 'Failed to communicate with the Underwriting Copilot' });
  }
});

export default router;
