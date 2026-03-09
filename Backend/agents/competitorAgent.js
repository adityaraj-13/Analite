import { searchWeb } from '../services/search.js';
import { askGemini } from '../services/gemini.js';

export const analyzeCompetitors = async (productName) => {
    const query = `top alternatives and competitors to ${productName} pricing comparison`;
    const webData = await searchWeb(query);
    
    const systemPrompt = `
    You are an expert Business Strategist. 
    Analyze the provided web search data to find alternatives to: "${productName}".
    Return ONLY a JSON object with this exact structure:
    {
        "marketPosition": "<1 sentence describing how ${productName} is positioned in the market>",
        "competitorsList": [
            {
                "name": "<well known competitor name>",
                "price": "<estimated price or pricing model>",
                "keyDifferentiator": "<why someone would choose this over ${productName}>",
                "threatLevel": <number 1-10, where 10 is the biggest threat>
            }
        ],
        "sourcesUsed": ["<URL 1>", "<URL 2>"]
    }
    Ensure the competitorsList has exactly 3 competitors.
    Rules:
    - competitorsList must contain exactly 3 real competitors.
    - Competitors should be widely recognized alternatives in the same category.
    - threatLevel should reflect market popularity, feature overlap, and brand strength relative to ${productName}.
    - Extract source URLs from the provided web data.
    `;

    return await askGemini(systemPrompt, webData);
};