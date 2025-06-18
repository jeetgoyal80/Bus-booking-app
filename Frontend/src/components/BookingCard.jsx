import React from "react";
import { motion } from "framer-motion";
import { FaBusAlt } from "react-icons/fa";
import PropTypes from "prop-types";

export default function BookingCard({ booking }) {
  const statusColor = {
    Upcoming: "text-blue-600",
    Completed: "text-green-600",
    cancelled: "text-red-500",
  };

  return (
    <motion.div
      className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex gap-4 items-center">
        <FaBusAlt className="text-xl text-blue-500" />
        <div>
          <h3 className="font-semibold text-lg">
            {booking?.bus?.from}-{booking?.bus?.to}
          </h3>
          <p className="text-gray-500 text-sm">
            {booking.date.split("T")[0]}
          </p>
          <p className="text-gray-600 text-sm">
            Seat No: {booking.seatNumbers.join(",")}
          </p>
        </div>
      </div>
      <div className={`font-medium ${statusColor[booking.status]}`}>
        {booking.status.toUpperCase()}
      </div>
    </motion.div>
  );
}

// ✅ Add PropTypes validation
BookingCard.propTypes = {
  booking: PropTypes.shape({
    bus: PropTypes.shape({
      from: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
    }),
    date: PropTypes.string.isRequired,
    seatNumbers: PropTypes.arrayOf(PropTypes.string).isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};
