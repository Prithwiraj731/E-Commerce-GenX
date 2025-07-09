import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useState } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <header className="w-full flex items-center px-6 py-2 bg-gray-950 shadow-2xl z-50 border-b border-gray-800">
      {/* Logo */}
      <div className="flex items-center cursor-pointer" onClick={() => navigate('/')} title="Home">
        <img src="/lunaria.svg" alt="Lunaria Logo" className="h-16 w-16 object-contain" />
      </div>
      {/* Centered Navigation */}
      <nav className="flex-1 flex justify-center">
        <div className="flex gap-8 font-medium tracking-wide text-white items-center">
          <Link to="/" className="hover:text-fuchsia-400 transition">Home</Link>
          <Link to="/about" className="hover:text-fuchsia-400 transition">About</Link>
          <Link to="/contact" className="hover:text-fuchsia-400 transition">Contact</Link>
          <Link to="/products" className="hover:text-fuchsia-400 transition">Products</Link>
        </div>
      </nav>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 mx-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="px-3 py-1 rounded-md bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-fuchsia-500 transition w-40 md:w-56"
        />
        <button type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-3 py-1 rounded-md font-semibold transition">Search</button>
      </form>
      {/* Auth Section */}
      <div className="flex items-center gap-2">
        {!token ? (
          <Link to="/login" className="hover:text-fuchsia-400 transition text-white font-medium">Login/Signup</Link>
        ) : (
          <div
            className="cursor-pointer flex items-center"
            onClick={() => navigate('/account')}
            title="Go to Account"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${(user?.name || 'User').replace(' ', '+')}&background=0D8ABC&color=fff&size=40`}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-fuchsia-500 object-cover shadow-md hover:scale-105 transition"
            />
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
