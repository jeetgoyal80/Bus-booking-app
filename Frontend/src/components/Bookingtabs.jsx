import React, { useState } from "react";
import BookingCard from "./BookingCard";
import PropTypes from "prop-types";

export default function BookingTabs({ bookings }) {
  const [activeTab, setActiveTab] = useState("Upcoming");

  const filtered = Array.isArray(bookings)
    ? bookings.filter((b) => b.status === activeTab)
    : [];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-center gap-4 mb-6">
        {["Upcoming", "Completed", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-medium transition
              ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((booking, idx) => (
            <BookingCard key={idx} booking={booking} />
          ))
        ) : (
          <div className="text-center text-gray-500">No bookings found.</div>
        )}
      </div>
    </div>
  );
}

BookingTabs.propTypes = {
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      // add other fields as needed (id, date, etc.)
    }),
  ).isRequired,
};
