import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="w-full bg-gray-950 text-white text-sm mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-center md:justify-between gap-8">
        {/* Logo */}
        <img src="/lunaria.svg" alt="Lunaria Logo" className="h-10 w-10" />
        {/* Privacy Policy Link */}
        <Link to="/privacy-policy" className="hover:text-fuchsia-400 transition text-base font-medium">Privacy Policy</Link>
        {/* Copyright */}
        <div className="text-gray-400 text-xs text-center md:text-right">
          © {new Date().getFullYear()} Lunaria Inc. — All rights reserved
        </div>
      </div>
    </footer>
  );
}

export default Footer;