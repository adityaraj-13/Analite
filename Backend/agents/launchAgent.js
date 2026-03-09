import { searchWeb } from '../services/search.js';
import { askGemini } from '../services/gemini.js';

export const analyzeLaunchMetrics = async (productName) => {
    const query = `${productName} product launch date announcement features target audience`;
    const webData = await searchWeb(query);
    
    const systemPrompt = `
    You are a Product Manager Analyst. 
    Analyze the provided web search data regarding the launch of: "${productName}".
    Return ONLY a JSON object with this exact structure:
    {
        "estimatedLaunchDate": "<when it was announced or released>",
        "launchPrice": "<price if mentioned, otherwise 'N/A'>",
        "targetAudience": "<who is this product built for>",
        "coreFeatures": ["<feature 1>", "<feature 2>", "<feature 3>"],
        "sourcesUsed": ["<URL 1>", "<URL 2>"]
    }
    Rules:
    - estimatedLaunchDate should be the most widely cited announcement or release date.
    - launchPrice should reflect the price at launch if mentioned.
    - targetAudience should be one concise sentence.
    - coreFeatures must contain exactly 3 of the most important features highlighted during launch.
    - Extract source URLs from the provided web data.
    `;

    return await askGemini(systemPrompt, webData);
};