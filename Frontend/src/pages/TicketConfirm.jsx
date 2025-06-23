import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

export default function TicketConfirm() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.user.token);
  console.log(user);

  const { selectedSeats, busDetails, travelDate } = location.state || {};

  //   console.log(busDetails);
  const totalFare = selectedSeats.length * busDetails.price;

  const handleConfirmBooking = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/tickets/book`,
        {
          busId: busDetails._id,
          date: travelDate,
          seatNumbers: selectedSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        navigate("/ticket-success", { state: { ticket: res.data.ticket } });
      }
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Try again.");
    }
  };

  if (!selectedSeats || !busDetails) return <div>No ticket data.</div>;

  return (
    <div className="min-h-screen bg-white p-6 text-gray-800">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Ticket Confirmation
      </h2>

      <div className="max-w-xl mx-auto bg-gray-100 p-4 rounded shadow">
        <p>
          <strong>Bus:</strong> {busDetails.busName} ({busDetails.busId})
        </p>
        <p>
          <strong>From:</strong> {busDetails.from} <strong>To:</strong>{" "}
          {busDetails.to}
        </p>
        <p>
          <strong>Date:</strong> {travelDate}
        </p>
        <p>
          <strong>Seats:</strong> {selectedSeats.join(", ")}
        </p>
        <p>
          <strong>Fare per seat:</strong> ₹{busDetails.price}
        </p>
        <p className="text-lg font-semibold mt-2 text-green-700">
          Total Fare: ₹{totalFare}
        </p>

        <button
          onClick={handleConfirmBooking}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold"
        >
          Confirm and Book
        </button>
      </div>
    </div>
  );
}
