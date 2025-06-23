import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa";

const SupportForm = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.email) setEmail(user.email);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setStatus("❌ Please enter a valid 10-digit Indian WhatsApp number.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/support/send`,
        { userNumber: cleanPhone, message: msg },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        },
      );

      setStatus("✅ Your message has been sent via WhatsApp!");
      setPhone("");
      setMsg("");
    } catch (err) {
      console.error("Support form error:", err);
      setStatus("❌ Failed to send your message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 flex flex-col md:flex-row items-start gap-10 bg-white shadow-xl rounded-xl border border-gray-200">
      {/* Left Side (Illustration & Text) */}
      <div className="w-full md:w-1/2 space-y-5">
        <h2 className="text-3xl font-bold text-blue-700">
          Contact Customer Support
        </h2>
        <p className="text-gray-600">
          Our support team is here to help with any issues related to your
          bookings, tickets, or payments. Just drop us a message and we’ll get
          back to you on WhatsApp!
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4760/4760908.png"
          alt="Customer Support"
          className="w-72 mx-auto md:mx-0"
        />
      </div>

      {/* Right Side (Form) */}
      <form onSubmit={handleSubmit} className="w-full md:w-1/2 space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Your Email
          </label>
          <input
            type="email"
            value={email}
            readOnly
            className="mt-1 w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
          />
        </div>

        {/* WhatsApp Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            WhatsApp Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91XXXXXXXXXX"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Please enter a valid 10-digit Indian number.
          </p>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Your Message
          </label>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Describe your issue or question in detail..."
            rows={5}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex justify-center items-center gap-2 transition disabled:opacity-50"
        >
          {loading ? (
            <span>Sending...</span>
          ) : (
            <>
              <FaWhatsapp /> Send via WhatsApp
            </>
          )}
        </button>

        {/* Status Message */}
        {status && (
          <p
            className={`text-center text-sm font-medium ${
              status.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {status}
          </p>
        )}
      </form>
    </div>
  );
};

export default SupportForm;
