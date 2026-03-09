import express from 'express';
import { analyzeProduct } from '../controllers/analyze_controller.js';

const router = express.Router();

// Route to analyze a product
router.post('/product', analyzeProduct);

export default router;