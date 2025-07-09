import React, { useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, fetchCart, loading } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // This effect ensures that if the user logs out on another tab,
    // this page redirects to login when it becomes active.
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, []);

  const handleRemoveFromCart = async (cartId) => {
    // Confirmation is good practice
    if (!window.confirm('Remove this item from your cart?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart(); // Refresh cart from context
    } catch (err) {
      alert('Failed to remove item from cart.');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) return;
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/cart/clear`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchCart(); // Refresh cart from context
    } catch (err) {
        alert('Failed to clear cart.');
    }
  };

  const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  if (loading) return <div className="min-h-screen bg-black flex justify-center items-center text-white text-xl">Loading Your Cart...</div>;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-100 to-purple-200 dark:from-black dark:via-indigo-950 dark:to-violet-900 text-black dark:text-white font-sans">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate('/products')} className="flex items-center gap-2 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold p-3 rounded-full bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 transition-colors">
            <FaArrowLeft />
            Continue Shopping
          </button>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          {cartItems.length > 0 && (
            <button
                onClick={handleClearCart}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold transition-colors"
            >
                <FaTrash />
                Clear Cart
            </button>
          )}
        </div>
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white/30 dark:bg-black/30 rounded-lg shadow-2xl">
            <h2 className="text-3xl mb-4">Your cart is empty.</h2>
            <Link to="/products" className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:scale-105 transition-transform inline-block">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-3/4">
              <div className="bg-white/30 dark:bg-black/30 rounded-lg shadow-2xl p-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex flex-col sm:flex-row justify-between items-center bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <img className="h-24 w-24 rounded-md object-cover" src={item.product.image} alt={item.product.name} />
                      <div>
                        <h3 className="font-semibold text-lg">{item.product.name}</h3>
                        <p className="text-sm text-gray-400">Color: {item.color} / Size: {item.size}</p>
                        <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                        <button onClick={() => handleRemoveFromCart(item._id)} className="text-red-400 hover:underline text-sm mt-1">
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-xl font-semibold text-fuchsia-400">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/4">
              <div className="bg-white/30 dark:bg-black/30 rounded-lg shadow-2xl p-6">
                <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-3">Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <hr className="my-2 border-gray-700" />
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white py-3 px-4 rounded-lg mt-6 w-full hover:scale-105 transition-transform font-semibold"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart; 