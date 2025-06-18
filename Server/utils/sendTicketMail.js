// utils/sendTicketEmail.js
import nodemailer from 'nodemailer';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import { Readable } from 'stream';

export const generateTicketPDFBuffer = async (ticket) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(22);
  doc.setTextColor("#1e3a8a");
  doc.text("Bus Ticket Confirmation", 70, 20);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`PNR: ${ticket.pnr}`, 14, 35);
  doc.text(`Status: ${ticket.status}`, 14, 42);
  doc.text(`Booked At: ${new Date(ticket.bookedAt).toLocaleString()}`, 14, 49);
  doc.text(`Travel Date: ${new Date(ticket.date).toLocaleDateString()}`, 14, 56);

  // Seats and Fare
  autoTable(doc, {
    startY: 65,
    head: [["Seat Numbers", "Total Fare"]],
    body: [[ticket.seatNumbers.join(", "), `₹ ${ticket.totalFare}`]],
  });

  // Bus Info
  if (ticket.bus && typeof ticket.bus === 'object') {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Bus Info"]],
      body: [
        [`Bus Number: ${ticket?.bus?.busId || "N/A"}`],
        [`From: ${ticket?.bus?.from || "N/A"} → To: ${ticket?.bus?.to || "N/A"}`],
      ],
    });
  }

  // QR Code
  const qrText = `PNR: ${ticket.pnr} | Seats: ${ticket.seatNumbers.join(", ")} | ₹${ticket.totalFare}`;
  const qrImage = await QRCode.toDataURL(qrText);
  doc.addImage(qrImage, "PNG", 150, 35, 40, 40);

  return doc.output("arraybuffer");
};

export const sendTicketEmail = async (user, ticket) => {
  const pdfBuffer = await generateTicketPDFBuffer(ticket);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Your Bus Ticket [PNR: ${ticket?.pnr}]`,
    text: `Dear ${user.name || user.email},\n\nYour ticket has been booked successfully.\n\nPNR: ${ticket?.pnr}\nSeats: ${ticket?.seatNumbers.join(",")}\nTotal Fare: ₹${ticket?.totalFare}\nStatus: ${ticket?.status}\n\nThank you for choosing us.\n\nRegards,\nBus Booking Team`,
    attachments: [
      {
        filename: `Ticket_${ticket.pnr}.pdf`,
        content: Buffer.from(pdfBuffer),
        contentType: 'application/pdf'
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
