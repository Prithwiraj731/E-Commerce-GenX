import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

function Home() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:3000/product');
        setProducts(res.data.products.slice(0, 4) || []);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { id: 1, name: 'Women', img: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg', link: "/category/women" },
    { id: 2, name: 'Men', img: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg', link: "/category/men" },
    { id: 3, name: 'Kids', img: 'https://images.pexels.com/photos/1619772/pexels-photo-1619772.jpeg', link: "/category/kids" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[60vh] py-20 px-4 text-center bg-gradient-to-b from-gray-900/90 via-gray-950/95 to-gray-950">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg" style={{textShadow: '0 4px 24px rgba(0,0,0,0.5)'}}>
          Welcome to <span className="text-fuchsia-500">Lunaria</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl mx-auto">
          Discover the fusion of fashion & futuristic tech at unbeatable prices.
        </p>
        <button
          className="px-12 py-4 rounded-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xl shadow-lg transition mb-8"
          onClick={() => navigate('/products')}
        >
          Shop Now
        </button>
        {/* Animated Down Arrow */}
        <div className="flex flex-col items-center mt-2 animate-bounce">
          <svg className="w-8 h-8 text-fuchsia-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>
      {/* Banner 1 (restored) */}
      <img
        src="/banner1.png"
        alt="Lunaria Banner 1"
        className="w-full rounded-none shadow-lg object-cover mb-8"
        style={{height: 'auto'}}
      />

      {/* Categories */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Top Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link to={category.link} key={category.id} className="group">
              <div className="bg-gray-900 rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center">
                <img
                  src={category.img}
                  alt={category.name}
                  className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition"
                />
                <span className="text-xl font-semibold">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Trending Products</h2>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-fuchsia-500"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link to="/products" key={product._id} className="block group">
                <div className="bg-gray-900 rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
                  <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="text-lg font-semibold truncate mb-1">{product.name}</h3>
                    <p className="text-fuchsia-400 font-bold">₹{product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">No trending products found.</div>
        )}
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Start Your Reselling Journey</h2>
        <p className="text-lg text-gray-300 mb-6">
          Become part of the Lunaria revolution and thrive with style & tech.
        </p>
        <button
          className="px-8 py-3 rounded-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold text-lg shadow transition"
          onClick={() => navigate('/join-seller')}
        >
          Join Now
        </button>
      </section>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <Link
          to="/cart"
          className="fixed bottom-8 right-8 bg-fuchsia-600 hover:bg-fuchsia-700 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
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
      {/* Banner 2 at the bottom */}
      <div className="w-full py-10 bg-gray-950">
        <img
          src="/banner2.png"
          alt="Lunaria Banner 2"
          className="w-full rounded-none shadow-lg object-cover"
          style={{height: 'auto'}}
        />
      </div>
    </div>
  );
}

export default Home;
