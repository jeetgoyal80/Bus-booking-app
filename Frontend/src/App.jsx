import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Loading from './pages/Loading';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import SeatSelection from './pages/SeatSelection';
import MyBookings from './pages/MyBookings';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TicketConfirm from './pages/TicketConfirm';
import TicketSuccess from './pages/TicketSuccess';
import SupportForm from './pages/SupportForm';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer position="top-center" autoClose={3000} />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search" element={<Search />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/seats/:id" element={<SeatSelection />} />
            <Route path="/ticket-confirm" element={<TicketConfirm />} />
            <Route path="/ticket-success" element={<TicketSuccess />} />
            <Route path="/support" element={<SupportForm />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}
