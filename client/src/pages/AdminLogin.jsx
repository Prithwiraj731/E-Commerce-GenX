import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

function AdminLogin() {
  const navigate = useNavigate();

  // State to manage form data, loading status, and error messages
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:3000/admin/login', formData);

      if (res.data.success && res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        navigate('/admin/home');
      } else {
        setError(res.data.msg || 'Login failed: Invalid response from server.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Invalid credentials or server error.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-8 left-8 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        title="Go Back"
      >
        <FaArrowLeft />
      </button>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
          Admin Portal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <span>{error}</span>
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500 transition"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500 transition"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-800 rounded-lg font-bold text-white hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;