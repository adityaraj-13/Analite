import { searchWeb } from '../services/search.js';
import { askGemini } from '../services/gemini.js';

export const analyzeSentiment = async (productName) => {
    // 1. Generate a specific search query
    const query = `latest customer reviews and complaints for ${productName} reddit forum`;
    
    // 2. Search the web
    const webData = await searchWeb(query);
    
    // 3. The Strict Prompt
    const systemPrompt = `
    You are an expert Market Sentiment Analyst. 
    Analyze the provided web search data for the product: "${productName}".
    Return ONLY a JSON object with the following structure:
    {
        "sentimentScore": <a number from 1 to 100, where 100 is perfectly positive>,
        "sentimentBreakdown": {
            "positive": <percentage number>,
            "neutral": <percentage number>,
            "negative": <percentage number>
        },
        "overallSummary": "<a 2-sentence summary of public opinion>",
        "topPraises": ["<praise 1>", "<praise 2>"],
        "topComplaints": ["<complaint 1>", "<complaint 2>"],
        "sourcesUsed": ["<URL 1>", "<URL 2>"]
    }
    Ensure the breakdown percentages add up to 100. Extract the source URLs from the provided text.
    Rules:
    - sentimentBreakdown percentages must sum to 100.
    - Base the analysis only on the provided data.
    - Extract real URLs from the text for sourcesUsed.
    `;

    // 4. Get and return the JSON from Gemini
    return await askGemini(systemPrompt, webData);
};