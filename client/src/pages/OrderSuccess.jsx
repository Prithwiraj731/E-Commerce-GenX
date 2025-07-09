import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-indigo-100 to-purple-200 dark:from-black dark:via-indigo-950 dark:to-violet-900 px-4">
      <div className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-10 text-black dark:text-white">
        {/* Soothing animation (SVG checkmark with pulse) */}
        <div className="mb-6">
          <svg className="w-24 h-24 text-green-500 animate-pulse" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="2">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" fill="currentColor" fillOpacity="0.05" />
            <path className="animate-success-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M16 24l7 7 11-13" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">Order Successful!</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">Thank you for your purchase.<br />Redirecting to the homepage...</p>
        <div className="mt-2 text-xs text-gray-400">Lunaria</div>
      </div>
      {/* Custom CSS for stroke animation */}
      <style>{`
        .animate-success-stroke {
          stroke-dasharray: 36;
          stroke-dashoffset: 36;
          animation: dash 1s ease forwards;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess; 