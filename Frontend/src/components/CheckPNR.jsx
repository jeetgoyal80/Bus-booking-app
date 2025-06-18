import React, { useState } from "react";
import axios from "axios";

const CheckPNR = () => {
  const [pnr, setPnr] = useState("");
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTicket(null);
    setStatus("");
    setLoading(true);

    if (!pnr.trim()) {
      setStatus("❌ Please enter your PNR.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/tickets/pnr`,
        { pnr: pnr.trim().toUpperCase() }
      );

      setTicket(response.data.ticket);
    } catch (err) {
      setStatus("❌ Ticket not found or server error.");
      console.error("PNR Lookup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
        Check Your Ticket by PNR
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={pnr}
          onChange={(e) => setPnr(e.target.value)}
          placeholder="Enter your PNR (e.g. CAE0D7B343)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Searching..." : "Check Ticket"}
        </button>
      </form>

      {status && <p className="mt-4 text-center text-red-600">{status}</p>}

      {ticket && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">🎫 Ticket Details</h3>
          <p><strong>PNR:</strong> {ticket.pnr}</p>
          <p><strong>Status:</strong> {ticket.status.toUpperCase()}</p>
          <p><strong>Route:</strong> {ticket.bus?.from} → {ticket.bus?.to}</p>
          <p><strong>Time:</strong> {ticket.bus?.departureTime}</p>
          <p><strong>Date:</strong> {ticket.date.split('T')[0]}</p>
        </div>
      )}
    </div>
  );
};

export default CheckPNR;
