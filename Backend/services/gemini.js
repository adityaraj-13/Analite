import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Google AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// We use 1.5 Flash because it is incredibly fast and has a huge context window
const model = genAI.getGenerativeModel({ 
    model: "gemini-3.1-flash-lite-preview",
    // This is the secret sauce: forcing the AI to return valid JSON
    generationConfig: {
        responseMimeType: "application/json",
    }
});

/**
 * Sends a prompt and web context to Gemini and returns a JSON object.
 * @param {string} systemPrompt - The strict instructions for the agent
 * @param {string} webData - The raw text scraped from Tavily
 * @returns {Promise<Object>} - The parsed JSON data
 */
export const askGemini = async (systemPrompt, webData) => {
    try {
        // We combine the instructions and the raw data into one massive prompt
        const fullPrompt = `
        ${systemPrompt}
        
        DATA TO ANALYZE:
        ${webData}
        `;

        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();
        
        // Because we set responseMimeType to application/json, 
        // we can safely parse this string into a Javascript object
        return JSON.parse(responseText);

    } catch (error) {
        console.error("❌ Gemini API Error:", error.message);
        throw new Error("Failed to analyze data with AI.");
    }
};

/**
 * Fast check to ensure the user input is a valid product or company.
 * Prevents wasting heavy API calls on gibberish or unrelated questions.
 */
export const validateInput = async (input) => {
    const systemPrompt = `
    You are an input validation assistant for a market research tool.
    Analyze the following user input: "${input}".
    Is this a valid name of a company, product, software, or brand that can be researched?
    Return ONLY a JSON object:
    {
        "isValid": true or false,
        "reason": "If false, briefly explain why in 1 sentence. If true, leave empty."
    }
    `;

    try {
        // We pass empty string for webData because we don't need the internet for this quick check
        return await askGemini(systemPrompt, ""); 
    } catch (error) {
        console.error("Guardrail error:", error);
        return { isValid: true }; // If the guardrail fails, let the request through just in case
    }
};