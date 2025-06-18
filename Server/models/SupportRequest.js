import mongoose from "mongoose";

const supportRequestSchema = new mongoose.Schema({
  userId: String,
  email: String,
  phone: String,
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'refund_requested', 'cancelled', 'escalated', 'resolved'], default: 'pending' },
  twilioSid: String,
  lastUserMessage: String,
  lastBotResponse: String,
}, { timestamps: true });

export default mongoose.model('SupportRequest', supportRequestSchema);
