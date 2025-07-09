import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

function Kids() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const { cartCount } = useCart();
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check login status and set user name
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    if (token) {
        const storedName = localStorage.getItem('userName');
        setUserName(storedName || 'User');
    }

    // Fetch products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:3000/product');
            // Filter products for kids' category - ONLY use category field set by admin, exact match
            const kidsProducts = res.data.products.filter(product => {
                if (!product.category) return false;
                const cat = product.category.trim().toLowerCase();
                return cat === 'kids' || cat === 'children';
            });
            setProducts(kidsProducts);
        } catch (error) {
            console.error("Failed to fetch kids' products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans transition-all duration-500 overflow-hidden">


      {/* Hero Section */}
      <section className="py-24 px-6 text-center relative overflow-hidden bg-gray-950">
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-800 rounded-full opacity-20 blur-3xl animate-pulse top-10 left-10"></div>
          <div className="absolute w-[30rem] h-[30rem] bg-indigo-600 rounded-full opacity-25 blur-2xl animate-spin-slow top-1/2 left-2/3"></div>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-wide drop-shadow-xl">
          <span className="bg-gradient-to-r from-fuchsia-400 to-indigo-500 text-transparent bg-clip-text">Kids'</span> Collection
        </h1>
        <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
          Discover adorable and comfortable fashion pieces for the little ones.
        </p>
      </section>

      {/* Products Section */}
      <section className="py-20 px-6 bg-gray-900 max-w-screen-xl mx-auto rounded-xl">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          Kids' Products
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fuchsia-500"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link to="/products" key={product._id} className="block group">
                <div className="bg-gradient-to-br from-gray-800 to-indigo-900 rounded-2xl shadow-xl group-hover:scale-105 transition-transform overflow-hidden">
                  <img src={product.image} alt={product.name} className="h-64 w-full object-cover" />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 truncate">{product.name}</h3>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <p className="text-fuchsia-400 font-bold text-xl">₹{product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold mb-4">No Kids' Products Found</h3>
            <p className="text-gray-400 mb-6">Check back later for new arrivals!</p>
            <Link to="/products" className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white px-8 py-3 rounded-full hover:scale-105 transition">
              View All Products
            </Link>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-gray-900 text-white py-20 text-center mt-20">
        <h2 className="text-4xl font-bold mb-4">Explore More Categories</h2>
        <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
          Discover our complete collection across all categories.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/category/women" className="bg-gradient-to-r from-white to-pink-100 text-violet-800 font-bold px-8 py-3 rounded-full hover:bg-pink-200 transition duration-300">
            Women's Collection
          </Link>
          <Link to="/category/men" className="bg-gradient-to-r from-white to-pink-100 text-violet-800 font-bold px-8 py-3 rounded-full hover:bg-pink-200 transition duration-300">
            Men's Collection
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 bg-gray-950 text-center text-gray-400 text-sm mt-12">
        <p className="mb-2">© 2025 Lunaria Inc. — Designed for the next generation</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-fuchsia-400 transition">Instagram</a>
          <a href="#" className="hover:text-fuchsia-400 transition">LinkedIn</a>
          <a href="#" className="hover:text-fuchsia-400 transition">GitHub</a>
        </div>
      </footer>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
          <Link
            to="/cart"
            className="fixed bottom-10 right-10 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            title="Go to Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              {cartCount}
            </span>
          </Link>
      )}
    </div>
  );
}

export default Kids; 