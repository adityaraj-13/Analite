import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Searches the web using Tavily API and returns clean, AI-ready text.
 * @param {string} query - The search query (e.g., "Spotify pricing changes 2024")
 * @returns {Promise<string>} - A concatenated string of web content
 */
export const searchWeb = async (query) => {
    try {
        const response = await axios.post('https://api.tavily.com/search', {
            api_key: process.env.TAVILY_API_KEY,
            query: query,
            search_depth: "advanced", // Digs deeper into articles, not just snippets
            include_answer: false,
            include_raw_content: false,
            max_results: 4, // 4 is the sweet spot: enough data, but doesn't overload the LLM
        });

        const results = response.data.results;
        console.log(`✅ Tavily Search Success for query "${query}": Found ${results.length} results.`);
        //console.log("Sample Result:", results);

        if (!results || results.length === 0) {
            return "No relevant information found on the web for this query.";
        }

        // We format the output so the AI knows exactly where the data came from
        let formattedContext = `--- WEB SEARCH RESULTS FOR: "${query}" ---\n\n`;
        
        results.forEach((result, index) => {
            formattedContext += `[Source ${index + 1}: ${result.url}]\n`;
            formattedContext += `${result.content}\n\n`;
        });

        //console.log("Formatted Web Context for AI:", formattedContext);

        return formattedContext;

    } catch (error) {
        console.error(`❌ Tavily Search Error for query "${query}":`, error.message);
        throw new Error("Failed to fetch web data.");
    }
};