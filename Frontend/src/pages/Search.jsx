import React, { useState } from 'react';
import SearchResults from '../components/SearchForm';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchResults } from '../redux_temp/Searchbusslice';
import { toast } from 'react-toastify';
import CheckPNR from '../components/CheckPNR';

const cityList = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune',
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Indore', 'Bhopal', 'Nagpur', 'Surat',
  'Patna', 'Chandigarh', 'Agra', 'Kanpur', 'Nashik', 'Varanasi'
];

export default function Search() {
  const dispatch = useDispatch();
  const buses = useSelector((state) => state.bus.results);
  const user = useSelector((state) => state.user.user);
  

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!from || !to || !date) {
      toast.warning("Please fill all fields before searching.");
      return;
    }




    try {
      console.log(user);
      
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
       `${import.meta.env.VITE_BACKEND_URL}/search`,
        { from, to, date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      dispatch(setSearchResults(res.data.buses));
      toast.success(`${res.data.buses.length} buses found!`);
    } catch (error) {
      console.error('Bus search error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to search buses.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFrom('');
    setTo('');
    setDate('');
    setFromSuggestions([]);
    setToSuggestions([]);
    dispatch(setSearchResults([]));
    toast.info("Search cleared.");
  };

  const filterSuggestions = (input) => {
    return cityList.filter(city =>
      city.toLowerCase().startsWith(input.toLowerCase())
    );
  };
      const getMaxDate = () => {
  const today = new Date();
  today.setMonth(today.getMonth() + 2);
  return today.toISOString().split('T')[0];
};

return (
  <div className="p-6 min-h-screen bg-blue-50">
    {/* Heading */}
    <motion.h1
      className="text-3xl font-bold mb-6 text-center text-blue-800"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      Book Your Bus
    </motion.h1>

    {/* Search Form */}
    <div className="bg-white shadow-md rounded-xl p-6 mb-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* From Input */}
        <div className="relative">
          <input
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setFromSuggestions(filterSuggestions(e.target.value));
            }}
            placeholder="From"
            className="w-full border p-3 rounded"
          />
          {fromSuggestions.length > 0 && (
            <ul className="absolute bg-white border rounded mt-1 z-10 w-full shadow">
              {fromSuggestions.map((city, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setFrom(city);
                    setFromSuggestions([]);
                  }}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* To Input */}
        <div className="relative">
          <input
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setToSuggestions(filterSuggestions(e.target.value));
            }}
            placeholder="To"
            className="w-full border p-3 rounded"
          />
          {toSuggestions.length > 0 && (
            <ul className="absolute bg-white border rounded mt-1 z-10 w-full shadow">
              {toSuggestions.map((city, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setTo(city);
                    setToSuggestions([]);
                  }}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Date Input */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)
            
          }
          min={new Date().toISOString().split('T')[0]}
          max={getMaxDate()} 
          className="border p-3 rounded"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Search Buses
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
        >
          Clear
        </button>
      </div>
    </div>

    {/* Results */}
    <SearchResults results={buses} loading={loading} />

    {/* Divider */}
    <div className="max-w-3xl mx-auto my-10 border-t border-gray-300" />

    {/* Check PNR Section */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <CheckPNR />
    </motion.div>
  </div>
);

}
