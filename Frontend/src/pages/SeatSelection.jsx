import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SeatSelection() {
  const busId = useParams().id;
  const [seats, setSeats] = useState([]);
  const [busDetails, setBusDetails] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchBusSeats() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/bus/${busId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        const seatData = res.data.seats;
        setSeats(seatData);
        setBusDetails(res.data); // entire bus object
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bus seats:", err);
        setLoading(false);
      }
    }

    fetchBusSeats();
  }, [busId]);

  const toggleSeat = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    navigate("/ticket-confirm", {
      state: {
        selectedSeats: selected,
        busDetails: busDetails,
        travelDate: new Date().toISOString().split("T")[0], // change to user-selected date if needed
      },
    });
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-blue-600">Loading seats...</div>
    );
  }

  // Grouping seats by rows of 4 with type-based positioning
  const rows = [];
  for (let i = 0; i < seats.length; i += 4) {
    const chunk = seats.slice(i, i + 4);
    let leftSide = [];
    let rightSide = [];

    chunk.forEach((seat) => {
      if (seat.type === "window" && leftSide.length === 0) {
        leftSide.push(seat);
      } else if (seat.type === "side" && leftSide.length < 2) {
        leftSide.push(seat);
      } else if (seat.type === "path" && rightSide.length === 0) {
        rightSide.push(seat);
      } else {
        rightSide.push(seat);
      }
    });

    while (leftSide.length < 2 && rightSide.length > 0) {
      leftSide.push(rightSide.shift());
    }
    while (rightSide.length < 2 && leftSide.length > 2) {
      rightSide.unshift(leftSide.pop());
    }

    rows.push([...leftSide, ...rightSide]);
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">
        Choose Your Seats
      </h2>

      <div className="flex flex-col gap-2 items-center">
        {rows.map((rowSeats, idx) => (
          <div key={idx} className="flex gap-4 justify-center">
            {/* Left Side */}
            <div className="flex gap-2">
              {rowSeats.slice(0, 2).map((seat) => (
                <motion.div
                  key={seat.seat_id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !seat.booked && toggleSeat(seat.seat_id)}
                  className={`w-12 h-12 flex items-center justify-center rounded-md cursor-pointer font-semibold text-sm
                    ${seat.booked ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-green-200 hover:bg-green-300"}
                    ${selected.includes(seat.seat_id) ? "ring-2 ring-blue-500" : ""}
                    ${seat.type === "window" ? "border-2 border-blue-400" : ""}
                    ${seat.type === "path" ? "border-2 border-yellow-500" : ""}
                    ${seat.type === "side" ? "border-2 border-purple-400" : ""}
                  `}
                >
                  {seat.seat_id}
                </motion.div>
              ))}
            </div>

            <div className="w-10" /> {/* Aisle gap */}

            {/* Right Side */}
            <div className="flex gap-2">
              {rowSeats.slice(2).map((seat) => (
                <motion.div
                  key={seat.seat_id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !seat.booked && toggleSeat(seat.seat_id)}
                  className={`w-12 h-12 flex items-center justify-center rounded-md cursor-pointer font-semibold text-sm
                    ${seat.booked ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-green-200 hover:bg-green-300"}
                    ${selected.includes(seat.seat_id) ? "ring-2 ring-blue-500" : ""}
                    ${seat.type === "window" ? "border-2 border-blue-400" : ""}
                    ${seat.type === "path" ? "border-2 border-yellow-500" : ""}
                    ${seat.type === "side" ? "border-2 border-purple-400" : ""}
                  `}
                >
                  {seat.seat_id}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 flex justify-center gap-6 text-sm text-gray-600 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-200 rounded" />
          Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-300 rounded" />
          Booked
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-200 ring-2 ring-blue-500 rounded" />
          Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-blue-400 bg-green-200 rounded" />
          Window
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-purple-400 bg-green-200 rounded" />
          Side
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-yellow-500 bg-green-200 rounded" />
          Path
        </div>
      </div>

      {/* Confirm Button */}
      <div className="flex justify-center mt-8">
        <button
          disabled={selected.length === 0}
          onClick={handleConfirm}
          className={`px-6 py-3 rounded-md font-semibold transition 
            ${selected.length > 0 ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}
          `}
        >
          Confirm ({selected.length})
        </button>
      </div>
    </motion.div>
  );
}
