import React from 'react';
import { FaStar, FaRocket, FaUsers } from 'react-icons/fa';

const About = () => (
  <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
    {/* Hero Section */}
    <div className="w-full max-w-3xl text-center mb-12">
      <h1 className="text-5xl font-extrabold mb-4 text-fuchsia-500 drop-shadow-lg">About Lunaria</h1>
      <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
        Lunaria is your one-stop shop for the latest fashion and tech at unbeatable prices. We are passionate about bringing you a seamless shopping experience with a focus on quality, style, and customer satisfaction.
      </p>
    </div>
    {/* Mission & Vision */}
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div className="bg-gray-900 rounded-xl p-8 shadow-lg flex flex-col items-center">
        <FaRocket className="text-fuchsia-400 text-4xl mb-3" />
        <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
        <p className="text-gray-300 text-center">To empower everyone to express themselves through fashion and technology, making style and innovation accessible to all.</p>
      </div>
      <div className="bg-gray-900 rounded-xl p-8 shadow-lg flex flex-col items-center">
        <FaStar className="text-fuchsia-400 text-4xl mb-3" />
        <h2 className="text-2xl font-bold mb-2">Our Vision</h2>
        <p className="text-gray-300 text-center">To be the most trusted and loved destination for modern shoppers, blending quality, affordability, and a futuristic experience.</p>
      </div>
    </div>
    {/* Values */}
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-bold text-center mb-6">Our Core Values</h2>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <div className="flex-1 bg-gray-900 rounded-xl p-6 shadow flex flex-col items-center">
          <FaUsers className="text-fuchsia-400 text-3xl mb-2" />
          <span className="font-semibold mb-1">Customer First</span>
          <span className="text-gray-400 text-center">We put our customers at the heart of everything we do.</span>
        </div>
        <div className="flex-1 bg-gray-900 rounded-xl p-6 shadow flex flex-col items-center">
          <FaRocket className="text-fuchsia-400 text-3xl mb-2" />
          <span className="font-semibold mb-1">Innovation</span>
          <span className="text-gray-400 text-center">We embrace change and drive progress in fashion and tech.</span>
        </div>
        <div className="flex-1 bg-gray-900 rounded-xl p-6 shadow flex flex-col items-center">
          <FaStar className="text-fuchsia-400 text-3xl mb-2" />
          <span className="font-semibold mb-1">Quality</span>
          <span className="text-gray-400 text-center">We are committed to delivering only the best products and service.</span>
        </div>
      </div>
    </div>
  </div>
);

export default About; 