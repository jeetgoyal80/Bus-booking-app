import { v4 as uuidv4 } from 'uuid';
import Bus from '../models/Bus.js';
import User from '../models/User.js';
import Ticket from '../models/Ticket.js';
import { generateTicketPDFBuffer, sendTicketEmail } from '../utils/sendTicketMail.js';

// ✅ Get user tickets
export const getUserTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await Ticket.find({ user: userId })
      .populate('bus', 'busId from to busType company departureTime arrivalTime price')
      .sort({ bookedAt: -1 });

    if (!tickets || tickets.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No tickets found',
      });
    }

    return res.status(200).send({
      success: true,
      message: 'Found tickets',
      tickets,
    });

  } catch (error) {
    console.error("Error in getUserTickets:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

// ✅ Book tickets
export const bookTickets = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { busId, date, seatNumbers } = req.body;

    if (!busId || !date || !seatNumbers || seatNumbers.length === 0) {
      return res.status(400).send({ error: 'All fields are required' });
    }

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).send({ error: 'Bus not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ error: 'User not found' });

    const unavailableSeats = seatNumbers.filter((seatNum) =>
      bus.seats.some((seat) => seat.seat_id === seatNum && seat.booked)
    );

    if (unavailableSeats.length > 0) {
      return res.status(400).send({ success: false, message: 'Some seats are already booked' });
    }

    const totalFare = bus.price * seatNumbers.length;
    const newTicket = new Ticket({
      user: userId,
      bus: bus._id,
      date,
      seatNumbers,
      totalFare,
      status: "Upcoming",
      bookedAt: new Date(),
      pnr: uuidv4().replace(/-/g, '').slice(0, 10).toUpperCase(),
    });

    await newTicket.save();

    // Mark seats as booked
    bus.seats = bus.seats.map(seat =>
      seatNumbers.includes(seat.seat_id) ? { ...seat, booked: true } : seat
    );
    await bus.save();

    // Generate and send ticket
    const pdfBuffer = await generateTicketPDFBuffer(newTicket, bus);
    await sendTicketEmail(user, newTicket);

    return res.status(201).send({
      success: true,
      message: 'Ticket booked and email sent',
      ticket: newTicket,
    });

  } catch (error) {
    console.error("Error in bookTickets:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};
export const pnrchecker =  async (req, res) => {
  const { pnr } = req.body;

  if (!pnr || typeof pnr !== 'string') {
    return res.status(400).json({ success: false, message: 'PNR is required.' });
  }

  try {
    const ticket = await Ticket.findOne({ pnr: pnr.trim().toUpperCase() }).populate('bus', 'from to departureTime arrivalTime');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'No ticket found with this PNR.' });
    }

    return res.status(200).json({ success: true, ticket });
  } catch (error) {
    console.error('PNR lookup error:', error);
    return res.status(500).json({ success: false, message: 'Server error. Try again later.' });
  }
};
