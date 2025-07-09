import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import { useUser } from '../context/UserContext';

function Login() {
  const navigate = useNavigate();
  const { login: contextLogin } = useUser();

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
      const res = await axios.post('http://localhost:3000/user/login', formData);
      if (res.data.success && res.data.token) {
        try {
          localStorage.setItem('token', res.data.token);
          // Fetch user profile with JWT
          const profileRes = await axios.get('http://localhost:3000/user/profile', {
            headers: { Authorization: `Bearer ${res.data.token}` }
          });
          if (profileRes.data.success && profileRes.data.user) {
            localStorage.setItem('user', JSON.stringify(profileRes.data.user));
            // Update context so Navbar updates
            contextLogin(profileRes.data.user, res.data.token);
          }
          // Verify it was saved
          if (localStorage.getItem('token')) {
            navigate('/');
          } else {
            throw new Error("Token was not saved in localStorage.");
          }
        } catch (storageError) {
          console.error("Failed to save to localStorage:", storageError);
          setError("Could not save login session. Please check your browser settings (e.g., disable private mode or allow site data).");
        }
      } else {
        setError(res.data.msg || 'Login failed: The server response was invalid.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Invalid credentials or server error.';
      setError(errorMessage);
      console.error('Login Error:', err);
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
          Welcome Back!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <span>{error}</span>
            </div>
          )}
          
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-indigo-600 rounded-lg font-bold text-white hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-300">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline font-semibold">
            Sign up here
          </Link>
        </p>

        <div className="text-center mt-4 border-t border-gray-700 pt-4">
            <Link 
                to="/admin/login" 
                className="text-sm text-gray-400 hover:text-red-400 hover:underline transition-all"
            >
                Are you an Admin?
            </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;