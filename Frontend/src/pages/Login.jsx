import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // ✅ Fixed import
// import { FcGoogle } from 'react-icons/fc';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/userSlice';

export default function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log(user);
      dispatch(loginSuccess({ user: user, token: token }));      
      navigate('/search');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential); // ✅ Correct usage
      const { email, sub: googleId } = decoded;

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, {
        email,
        googleId,
      });

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/search');
    } catch (error) {
      alert(error.response?.data?.message || 'Google login failed!');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700">Welcome Back!</h2>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md font-semibold transition ${loading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <div className="h-px bg-gray-300 w-1/4" />
          <span>OR</span>
          <div className="h-px bg-gray-300 w-1/4" />
        </div>

        <div className="flex justify-center mt-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert('Google Login Failed')}
            shape="pill"
            theme="outline"
            width="250"
          />
        </div>


        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </motion.form>
    </div>
  );
}
