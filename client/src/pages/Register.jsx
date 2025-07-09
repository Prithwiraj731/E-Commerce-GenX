import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/user/register', formData);
      if (res.data.success) {
        alert('Signup successful! Please log in.');
        navigate('/login');
      } else {
        alert(res.data.msg || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      alert('Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-950 px-4 py-10 text-white">
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-8 left-8 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        title="Go Back"
      >
        <FaArrowLeft />
      </button>
      <div className="w-full max-w-md bg-gray-800 shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="your_name"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-fuchsia-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="1234567890"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-teal-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-500 transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-indigo-600 rounded-lg font-bold text-white hover:scale-105 transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register; 