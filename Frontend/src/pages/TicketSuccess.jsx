import React from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import logo from "../assets/image.png"; // ✅ Add your logo image to src/assets/

export default function TicketSuccess() {
  const { state } = useLocation();
  const ticket = state?.ticket;

  const generatePDF = async (ticket) => {
    const doc = new jsPDF();

    // Logo
    const img = new Image();
    img.src = logo;
    doc.addImage(img, "PNG", 15, 10, 25, 25);

    // Title
    doc.setFontSize(22);
    doc.setTextColor("#1e3a8a");
    doc.text("Bus Ticket Confirmation", 50, 20);

    // Basic Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Passenger: ${ticket.user?.name || "N/A"}`, 14, 40);
    doc.text(`Email: ${ticket.user?.email || "N/A"}`, 14, 47);
    doc.text(`PNR: ${ticket.pnr}`, 14, 54);
    doc.text(`Status: ${ticket.status}`, 14, 61);
    doc.text(
      `Booked At: ${new Date(ticket.bookedAt).toLocaleString()}`,
      14,
      68,
    );
    doc.text(
      `Travel Date: ${new Date(ticket.date).toLocaleDateString()}`,
      14,
      75,
    );

    // Seats and Fare
    autoTable(doc, {
      startY: 85,
      head: [["Seat Numbers", "Total Fare"]],
      body: [[ticket.seatNumbers.join(", "), `₹${ticket.totalFare}`]],
    });

    // Bus Info
    if (ticket.bus && typeof ticket.bus === "object") {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Bus Information"]],
        body: [
          [`Bus Name: ${ticket?.bus?.busId || "N/A"}`],
          [
            `From: ${ticket?.bus?.from || "N/A"} → To: ${ticket.bus.to || "N/A"}`,
          ],
          [`Bus Number: ${ticket.bus.busNumber || "N/A"}`],
        ],
      });
    }

    // QR Code
    const qrText = `PNR: ${ticket.pnr} | Seats: ${ticket.seatNumbers.join(", ")} | ₹${ticket.totalFare}`;
    const qrImage = await QRCode.toDataURL(qrText);
    doc.addImage(qrImage, "PNG", 150, 45, 40, 40);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(
      "Note: Please carry a valid ID proof during travel. This ticket is non-refundable.",
      14,
      280,
    );

    doc.save(`Ticket_${ticket.pnr}.pdf`);
  };

  if (!ticket) return <div>No ticket info found.</div>;

  return (
    <div className="min-h-screen bg-green-50 p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-green-700 mb-4">
        Booking Successful!
      </h2>
      <div className="bg-white shadow p-6 rounded w-full max-w-md text-gray-800">
        <p>
          <strong>PNR:</strong> {ticket.pnr}
        </p>
        <p>
          <strong>Seats:</strong> {ticket.seatNumbers.join(", ")}
        </p>
        <p>
          <strong>Total Fare:</strong> ₹{ticket.totalFare}
        </p>
        <p>
          <strong>Status:</strong> {ticket.status}
        </p>
        <p>
          <strong>Booked At:</strong>{" "}
          {new Date(ticket.bookedAt).toLocaleString()}
        </p>
        <p>
          <strong>Travel Date:</strong>{" "}
          {new Date(ticket.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Passenger:</strong> {ticket.user?.name}
        </p>
        <p>
          <strong>Email:</strong> {ticket.user?.email}
        </p>
      </div>

      <button
        onClick={() => generatePDF(ticket)}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
      >
        Download Ticket PDF
      </button>
    </div>
  );
}
