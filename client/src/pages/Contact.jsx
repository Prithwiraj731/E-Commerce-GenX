import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => (
  <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
    <div className="w-full max-w-lg bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-4 text-fuchsia-500 drop-shadow-lg">Contact Us</h1>
      <p className="text-lg text-gray-300 text-center mb-6">
        Have questions or need support? Reach out to us and our team will get back to you as soon as possible.
      </p>
      <div className="flex flex-col gap-3 w-full mb-6">
        <div className="flex items-center gap-3 text-fuchsia-400"><FaEnvelope /> <a href="mailto:support@lunaria.com" className="underline">support@lunaria.com</a></div>
        <div className="flex items-center gap-3 text-fuchsia-400"><FaPhone /> <span>+1 234 567 8901</span></div>
        <div className="flex items-center gap-3 text-fuchsia-400"><FaMapMarkerAlt /> <span>123 Fashion Ave, Tech City</span></div>
      </div>
      {/* Simple Contact Form (no backend) */}
      <form className="w-full flex flex-col gap-4">
        <input type="text" placeholder="Your Name" className="bg-gray-800 p-3 rounded-md text-white outline-none focus:ring-2 focus:ring-fuchsia-500" required />
        <input type="email" placeholder="Your Email" className="bg-gray-800 p-3 rounded-md text-white outline-none focus:ring-2 focus:ring-fuchsia-500" required />
        <textarea placeholder="Your Message" className="bg-gray-800 p-3 rounded-md text-white outline-none focus:ring-2 focus:ring-fuchsia-500" rows={4} required />
        <button type="submit" className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-fuchsia-800 rounded-lg font-bold text-white hover:scale-105 transition-all">Send Message</button>
      </form>
    </div>
  </div>
);

export default Contact; 