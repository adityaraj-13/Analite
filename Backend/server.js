import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyze_routes from './routes/analyze_route.js';
import { connectDB } from './config/db.js';

// import { searchWeb } from './services/search.js';
// import { askGemini } from './services/gemini.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to parse JSON bodies from frontend requests

// Basic Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'success', 
        message: 'Analite Server is running! 🚀' 
    });
});



app.use('/api', analyze_routes);
// connecting to db
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`Server is running on port ${PORT}`);
    console.log(`=================================`);
});














// // 🧪 TEMPORARY TEST ROUTE: Delete this before final submission!
// app.get('/api/test-engine', async (req, res) => {
//     try {
//         console.log("1. Starting search...");
//         // Let's hardcode a query just to test
//         const rawWebData = await searchWeb("What are the biggest complaints about the iPhone 15 right now?");
        
//         console.log("2. Search finished. Sending to Gemini...");
        
//         // We write a strict prompt asking for JSON
//         const systemPrompt = `
//         You are an expert tech analyst. Read the provided web data.
//         Return ONLY a JSON object containing the top 3 complaints.
//         Format must be:
//         {
//             "product": "iPhone 15",
//             "topComplaints": ["complaint 1", "complaint 2", "complaint 3"]
//         }
//         `;

//         const finalAnalysis = await askGemini(systemPrompt, rawWebData);
        
//         console.log("3. Gemini finished! Sending to browser...");
        
//         // Send the beautiful JSON to your browser
//         res.status(200).json({
//             status: "success",
//             data: finalAnalysis
//         });

//     } catch (error) {
//         console.error("Test Route Error:", error);
//         res.status(500).json({ error: error.message });
//     }
// });

// We will import and use our specific routes here later
// app.use('/api/analyze', analyzeRoutes);