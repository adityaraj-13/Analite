import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        lowercase: true, // Saves "Apple" and "apple" as the same thing
        trim: true
    },
    sentiment: { type: Object, required: true },
    competitors: { type: Object, required: true },
    launchMetrics: { type: Object, required: true },
    analyzedAt: {
        type: Date,
        default: Date.now,
        expires: 604800 // Auto-delete documents after 7 days (604,800 seconds). Keeps data fresh!
    }
});

const Report = mongoose.model('Report', reportSchema);
export default Report;