import React, { useEffect } from "react";
import BookingTabs from "../components/BookingTabs";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setmybookingResults } from "../redux/mybookingslice";

export default function MyBookings() {
  const bookings = useSelector((state)=> state.mybooking.results)
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchBusSeats() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/tickets/my-tickets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        dispatch(setmybookingResults(res.data.tickets));
        
        
        
      } catch (err) {
        console.error("Error fetching my-bookings", err);
     
      }
    }

    fetchBusSeats();
  }, [token]);

  

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-10 text-blue-800">My Journeys</h1>
      <BookingTabs bookings={bookings} />
    </div>
  );
}
