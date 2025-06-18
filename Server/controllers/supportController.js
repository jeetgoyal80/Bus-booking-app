// File: controllers/supportController.js
import twilio from 'twilio';
import Ticket from '../models/Ticket.js';
import SupportRequest from '../models/SupportRequest.js';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Utility: format a list of tickets
const formatTickets = (tickets) => {
  return tickets
    .map(
      (t, i) => `${i + 1}. PNR: ${t.pnr} | ${t.bus.from}→${t.bus.to} on ${t.date} | Seats: ${t.seatNumbers.join(', ')}`
    )
    .join('\n');
};

export const sendSupportMessage = async (req, res) => {
  const { id: userId, email, name } = req.user || {};
  const { userNumber, message }     = req.body;

  if (!userNumber || !message) {
    return res.status(400).json({ success: false, error: 'Phone number and message are required.' });
  }

  try {
    // Cleanup old resolved requests
    await SupportRequest.deleteMany({ phone: userNumber, email, status: 'resolved' });

    // Create or update an ongoing support conversation
    let supportReq = await SupportRequest.findOne({ phone: userNumber, email, status: { $ne: 'resolved' } });
    if (supportReq) {
      supportReq.message = message.trim();
    } else {
      supportReq = new SupportRequest({ userId, email, phone: userNumber, message: message.trim(), status: 'pending' });
    }
    await supportReq.save();

    // Send initial menu
    const greeting = name ? `Hello ${name},` : 'Hello,';
    const menu = `
${greeting}

Thank you for contacting TripEase Support!  
Please reply with:
1️⃣ View upcoming tickets  
2️⃣ Request a refund  
3️⃣ Cancel a ticket  
4️⃣ Speak with a live agent
    `.trim();

    const twilioMsg = await client.messages.create({
      from: 'whatsapp:+14155238886',
      to:   `whatsapp:+91${userNumber}`,
      body: menu,
    });

    supportReq.twilioSid = twilioMsg.sid;
    await supportReq.save();

    return res.json({ success: true, message: 'Menu sent via WhatsApp.' });
  } catch (err) {
    console.error('sendSupportMessage error:', err);
    return res.status(500).json({ success: false, error: 'Failed to send support menu.' });
  }
};

export const handleIncomingMessage = async (req, res) => {
  try {
    const from      = req.body.From;             // 'whatsapp:+91XXXXXXXXXX'
    const rawBody   = req.body.Body?.trim() || '';
    const text      = rawBody.toLowerCase();
    const phone     = from.replace('whatsapp:+91', '');

    // Fetch the current support request
    let supportReq = await SupportRequest.findOne({ phone }).sort({ updatedAt: -1 });
    if (!supportReq) return res.sendStatus(404);

    // Load all user tickets
    const tickets = await Ticket.find({ user: supportReq.userId, status: { $ne: 'cancelled' } }).populate('bus');

    let reply, newStatus;

    // State machine: if awaiting PNR for cancellation
    if (supportReq.status === 'awaiting_cancel_pnr') {
      const pnr = rawBody.toUpperCase();
      const ticket = await Ticket.findOne({ user: supportReq.userId, pnr }).populate('bus','from to');
      if (ticket && ticket.status !== 'cancelled') {
        ticket.status = 'cancelled';
        await ticket.save();
        reply = `✅ Ticket ${pnr} cancelled successfully. A refund will be processed shortly.`;
        newStatus = 'resolved';
      } else {
        reply = `❌ Invalid PNR “${pnr}”. Please reply with a valid PNR from your upcoming tickets.`;
      }
    } else {
      // Main menu choices
      if (/^(1|ticket)/.test(text)) {
        if (tickets.length === 0) {
          reply = 'ℹ️ You have no upcoming tickets.';
        } else {
          reply = `🎫 Your upcoming tickets:\n${formatTickets(tickets)}\n\nTo cancel one, reply “3”.`;
        }
      }
      else if (/^(2|refund)/.test(text)) {
        reply = '💸 Your refund request is noted. You will receive confirmation within 3–5 business days.';
        newStatus = 'resolved';
      }
      else if (/^(3|cancel)/.test(text)) {
        if (tickets.length === 0) {
          reply = 'ℹ️ You have no tickets to cancel.';
          newStatus = 'resolved';
        } else {
          reply = `❓ Please reply with the PNR of the ticket you wish to cancel.\nYour upcoming tickets:\n${formatTickets(tickets)}`;
          newStatus = 'awaiting_cancel_pnr';
        }
      }
      else if (/^(4|agent|human)/.test(text)) {
        reply = '👨‍💻 A live agent will be with you shortly.';
        newStatus = 'escalated';
      }
      else {
        reply = `❓ Sorry, I didn’t understand. Reply with:
1️⃣ View upcoming tickets  
2️⃣ Request a refund  
3️⃣ Cancel a ticket  
4️⃣ Talk to agent`;
      }
    }

    // Send the reply
    await client.messages.create({
      from: 'whatsapp:+14155238886',
      to:   from,
      body: reply,
    });

    // Update the support request
    supportReq.lastUserMessage = rawBody;
    supportReq.lastBotResponse = reply;
    if (newStatus) supportReq.status = newStatus;
    supportReq.updatedAt = Date.now();
    await supportReq.save();

    // If final, delete for fresh next time
    if (['resolved', 'escalated'].includes(supportReq.status)) {
      await SupportRequest.deleteOne({ _id: supportReq._id });
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error('handleIncomingMessage error:', err);
    return res.sendStatus(500);
  }
};
