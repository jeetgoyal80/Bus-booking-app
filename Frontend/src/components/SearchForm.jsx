import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FaBusAlt, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SearchResults({ results, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <motion.div
          className="w-10 h-10 bg-blue-500 rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
        <span className="ml-4 text-blue-600 font-medium text-lg">
          Searching buses...
        </span>
      </div>
    );
  }

  if (!loading && results.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10 text-lg">
        No buses found. Try different cities or date.
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {results.map((bus) => {
        const discount =
          bus.originalPrice && bus.originalPrice > bus.price
            ? Math.round(
                ((bus.originalPrice - bus.price) / bus.originalPrice) * 100,
              )
            : 0;

        return (
          <motion.div
            key={bus._id}
            className="bg-white border shadow-md p-5 rounded-lg hover:shadow-lg transition-all"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <FaBusAlt className="text-blue-600 text-xl" />
                <div>
                  <h2 className="font-bold text-lg text-gray-800">
                    {bus.company}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {bus.from} → {bus.to} • {bus.busType || "Standard Bus"}
                  </p>
                </div>
              </div>

              {bus.rating && (
                <div className="flex items-center text-sm text-yellow-500 font-medium">
                  <FaStar className="mr-1" />
                  {bus.rating.toFixed(1)}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-3">
              <div className="text-gray-700 text-sm">
                <p>
                  <span className="font-medium">Departure:</span>{" "}
                  {bus.departureTime || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Arrival:</span>{" "}
                  {bus.arrivalTime || "N/A"}
                </p>
              </div>

              <div className="text-right">
                {bus.originalPrice && bus.originalPrice > bus.price && (
                  <p className="text-sm text-gray-500 line-through">
                    ₹{bus.originalPrice}
                  </p>
                )}
                <p className="text-blue-700 text-xl font-bold">₹{bus.price}</p>
                {discount > 0 && (
                  <p className="text-green-600 text-sm font-medium">
                    {discount}% OFF
                  </p>
                )}
                <button
                  onClick={() => navigate(`/seats/${bus._id}`)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  View Seats
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ✅ Add prop-types validation
SearchResults.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      from: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      busType: PropTypes.string,
      departureTime: PropTypes.string,
      arrivalTime: PropTypes.string,
      price: PropTypes.number.isRequired,
      originalPrice: PropTypes.number,
      rating: PropTypes.number,
    }),
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};
