import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assumes you have a User model
    required: true
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus', // References the Bus model
    required: true
  },
  date: {
    type: Date, // Travel date
    required: true
  },
  seatNumbers: {
    type: [Number], // e.g., "A1", "B2"
    required: true
  },
  totalFare: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Upcoming','Completed', 'cancelled'],
    default: 'Upcoming'
  },
  bookedAt: {
    type: Date,
    default: Date.now
  },
  pnr: {
    type: String,
    unique: true,
    required: true
  }
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', TicketSchema);
export default Ticket;
