import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';

const SERVICE_ID = 'service_f3t36p7';
const TEMPLATE_ID = 'template_gl70psu';
const USER_ID = 'uXmJwmkMkhhqzjk4O';

const JoinSeller = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    productType: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          product_type: form.productType,
          message: form.description,
        },
        USER_ID
      );
      setSuccess(true);
    } catch (err) {
      setError('Failed to send request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-indigo-100 to-purple-200 dark:from-black dark:via-indigo-950 dark:to-violet-900 px-4 py-10">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-10 text-center">
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">Request Sent!</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">Thank you for your interest in selling with us. We will contact you soon.</p>
          <button
            className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition"
            onClick={() => navigate('/')}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-indigo-100 to-purple-200 dark:from-black dark:via-indigo-950 dark:to-violet-900 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-10"
      >
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-fuchsia-500 to-purple-400 text-transparent bg-clip-text">Join as a Seller</h2>
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Product Type</label>
          <input
            type="text"
            name="productType"
            value={form.productType}
            onChange={handleChange}
            required
            placeholder="e.g. T-shirt, Saree, etc."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          />
        </div>
        <div className="mb-8">
          <label className="block mb-2 font-semibold">Product Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:scale-105 transition mt-2 disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default JoinSeller; 