import mongoose from "mongoose";

const SeatSchema = new mongoose.Schema({
  seat_id: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['window', 'side', 'path'],
    required: true
  },
  booked: {
    type: Boolean,
    default: false
  }
});

const BusSchema = new mongoose.Schema({
  busId: {
    type: String,
    unique: true,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  busType: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReview: {
    type: Number,
    default: 0
  },
  badges: [{
    type: String
  }],
  seats: [SeatSchema]
}, { timestamps: true });

const Bus = mongoose.model('Bus', BusSchema);
export default Bus;
