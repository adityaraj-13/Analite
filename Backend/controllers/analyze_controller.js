import { analyzeCompetitors } from '../agents/competitorAgent.js';
import { analyzeLaunchMetrics } from '../agents/launchAgent.js';
import { analyzeSentiment } from '../agents/sentimentAgent.js';
import { validateInput } from '../services/gemini.js';
import Report from '../models/report_model.js';

export const analyzeProduct = async (req, res) => {
    try{
        const { productName } = req.body;

        if(!productName){
            return res.status(400).json({ error: "Product name is required in the request body." });
        }

        //Input validation
        console.log(`🛡️ Validating input: "${productName}"...`);
        const validation = await validateInput(productName);
        
        if (!validation.isValid) {
            return res.status(400).json({ 
                success: false, 
                message: validation.reason || "Please enter a valid product or company name." 
            });
        }

        // cache results in DB here if needed in the future to save costs on repeated queries
        console.log(`🔍 Checking database for existing report on: ${productName}...`);
        const existingReport = await Report.findOne({ productName: productName.toLowerCase().trim() });

        if (existingReport) {
            console.log(`⚡ Cache Hit! Returning saved report for ${productName}`);
            return res.status(200).json({
                success: true,
                message: "Fetched from database cache",
                data: existingReport
            });
        }


        console.log(`Starting analysis for product: ${productName}`);

        const [sentimentData, competitorData, launchData] = await Promise.all([
            analyzeSentiment(productName),
            analyzeCompetitors(productName),
            analyzeLaunchMetrics(productName)
        ]);

        console.log("All analyses completed. Compiling report...");

        const masterReport = {
            product: productName,
            analyzedAt: new Date().toISOString(),
            sentiment: sentimentData,
            competitors: competitorData,
            launchMetrics: launchData
        };

        const newReport = await Report.create({
            productName: productName.toLowerCase().trim(),
            sentiment: sentimentData,
            competitors: competitorData,
            launchMetrics: launchData
        });

        res.status(200).json({
            success: true,
            data: masterReport
        });

    }catch(error){
        console.error("Analyze Product Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while analyzing the product.",
            error: error.message });
    }
};