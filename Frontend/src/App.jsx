import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Loading from './pages/Loading';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 🐢 Lazy-loaded components
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Search = React.lazy(() => import('./pages/Search'));
const MyBookings = React.lazy(() => import('./pages/MyBookings'));
const SeatSelection = React.lazy(() => import('./pages/SeatSelection'));
const TicketConfirm = React.lazy(() => import('./pages/TicketConfirm'));
const TicketSuccess = React.lazy(() => import('./pages/TicketSuccess'));
const SupportForm = React.lazy(() => import('./pages/SupportForm'));

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
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
          <Suspense fallback={<Loading />}>
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
          </Suspense>
        </>
      )}
    </BrowserRouter>
  );
}
