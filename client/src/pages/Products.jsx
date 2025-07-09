import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaArrowLeft } from 'react-icons/fa';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/product');
        // Add a quantity field to each product
        const productsWithQuantity = res.data.products.map(p => ({ ...p, quantity: 1 }));
        setProducts(productsWithQuantity || []);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1
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

    // Use the selected quantity
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
      await fetchCart(); // Refresh the global cart state
      // Redirect to cart page on success
      navigate('/cart');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart.');
    }
  };

  if (loading) return <p className="text-center py-10">Loading Products...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-violet-900 text-white font-sans">
      <section className="py-10 px-4 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/')} className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors" title="Back to Home">
              <FaArrowLeft />
          </button>
          <h2 className="text-3xl font-bold">All Products</h2>
        </div>
        {products.length === 0 ? (
          <p className="text-center py-20 text-xl">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product._id} className="bg-gradient-to-br from-gray-800 to-indigo-900 rounded-2xl shadow-xl hover:scale-105 hover:shadow-fuchsia-500/20 transition-all duration-300 group flex flex-col">
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
                    className="mt-auto w-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white py-2 rounded-lg hover:scale-105 transition-transform text-md font-semibold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Products;