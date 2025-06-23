import React from "react";
import { useNavigate } from "react-router-dom";
import SearchForm from "../components/SearchForm";

export default function Home() {
  const navigate = useNavigate();
  const handleSearch = (filters) => {
    // navigate to results with state or query params
    navigate(
      `/search?from=${filters.from}&to=${filters.to}&date=${filters.date}`,
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-500 to-indigo-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Book Your Bus</h1>
        <SearchForm onSearch={handleSearch} />
      </div>
    </div>
  );
}
