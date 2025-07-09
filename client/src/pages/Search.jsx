import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Search() {
  const query = useQuery();
  const q = query.get('q') || '';
  const [products, setProducts] = useState([]);
  const [related, setRelated] = useState([]);
  const [complementary, setComplementary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/product/search?q=${encodeURIComponent(q)}`);
        setProducts(res.data.products.map(p => ({ ...p, quantity: 1 })));
        // Get recommendations based on first result
        if (res.data.products.length > 0) {
          const baseId = res.data.products[0]._id;
          const recRes = await axios.get(`http://localhost:3000/product/recommend?productId=${baseId}`);
          setRelated(recRes.data.related || []);
          setComplementary(recRes.data.complementary || []);
        } else {
          setRelated([]);
          setComplementary([]);
        }
      } catch (err) {
        setError('Failed to fetch search results.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [q]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setProducts(products.map(p =>
      p._id === productId ? { ...p, quantity: newQuantity } : p
    ));
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }
    const cartData = {
      product: product._id,
      quantity: product.quantity,
      color: product.colors[0],
      size: product.sizes[0],
    };
    try {
      await axios.post('http://localhost:3000/cart', cartData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCart();
      navigate('/cart');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <section className="py-10 px-4 max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Search Results for "{q}"</h2>
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center py-20 text-xl">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {products.map((product) => (
              <div key={product._id} className="bg-gray-900 rounded-2xl shadow-xl hover:scale-105 hover:shadow-fuchsia-500/20 transition-all duration-300 group flex flex-col">
                <img src={product.image} alt={product.name} className="h-48 w-full object-cover rounded-t-2xl" />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg mb-2 truncate group-hover:text-fuchsia-400 transition-colors">{product.name}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xl text-fuchsia-400 font-bold">₹{product.price * product.quantity}</p>
                    <div className="flex items-center gap-2 border border-slate-600 rounded-md">
                      <button onClick={() => handleQuantityChange(product._id, product.quantity - 1)} className="px-2 py-1 text-lg font-bold hover:bg-slate-700 rounded-l-md">-</button>
                      <span className="font-bold">{product.quantity}</span>
                      <button onClick={() => handleQuantityChange(product._id, product.quantity + 1)} className="px-2 py-1 text-lg font-bold hover:bg-slate-700 rounded-r-md">+</button>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="mt-auto w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white py-2 rounded-lg transition-transform text-md font-semibold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Recommendations */}
        {(related.length > 0 || complementary.length > 0) && (
          <div className="mt-10">
            {related.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-fuchsia-400">Related Products</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {related.map(product => (
                    <div key={product._id} className="bg-gray-900 rounded-2xl shadow-lg flex flex-col">
                      <img src={product.image} alt={product.name} className="h-40 w-full object-cover rounded-t-2xl" />
                      <div className="p-3 flex flex-col flex-grow">
                        <h4 className="font-semibold text-md mb-1 truncate">{product.name}</h4>
                        <p className="text-fuchsia-400 font-bold">₹{product.price}</p>
                        <button onClick={() => navigate(`/products`)} className="mt-2 text-xs text-fuchsia-300 underline">View</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {complementary.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-indigo-400">You May Also Like</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {complementary.map(product => (
                    <div key={product._id} className="bg-gray-900 rounded-2xl shadow-lg flex flex-col">
                      <img src={product.image} alt={product.name} className="h-40 w-full object-cover rounded-t-2xl" />
                      <div className="p-3 flex flex-col flex-grow">
                        <h4 className="font-semibold text-md mb-1 truncate">{product.name}</h4>
                        <p className="text-indigo-400 font-bold">₹{product.price}</p>
                        <button onClick={() => navigate(`/products`)} className="mt-2 text-xs text-indigo-300 underline">View</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Search; 