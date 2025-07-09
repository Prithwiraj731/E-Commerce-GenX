import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, fetchCart } = useCart();
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showNewCard, setShowNewCard] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    // Fetch saved cards
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get('http://localhost:3000/user/card', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCards(res.data.cards || []);
      } catch (err) {
        setCards([]);
      }
    };
    // Fetch saved addresses
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get('http://localhost:3000/user/address', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddresses(res.data.addresses || []);
      } catch (err) {
        setAddresses([]);
      }
    };
    fetchCards();
    fetchAddresses();
  }, []);

  const handleCardSelect = idx => {
    setSelectedCard(idx);
    setShowNewCard(false);
    setError('');
  };

  const handleNewCardChange = e => {
    setNewCard({ ...newCard, [e.target.name]: e.target.value });
    setError('');
  };

  const validateCard = () => {
    const { number, name, expiry, cvv } = newCard;
    if (!number.match(/^\d{16}$/)) return 'Card number must be 16 digits.';
    if (!name.trim()) return 'Name is required.';
    if (!expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/)) return 'Expiry must be MM/YY.';
    if (!cvv.match(/^\d{3}$/)) return 'CVV must be 3 digits.';
    return '';
  };

  const handleProceed = async () => {
    setError('');
    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (!selectedAddress) {
      setError('Please select a shipping address.');
      return;
    }
    let paymentMethod = 'online';
    let paymentReciptId = 'dummy-receipt';
    if (showNewCard) {
      const errMsg = validateCard();
      if (errMsg) {
        setError(errMsg);
        return;
      }
      paymentMethod = 'online';
      paymentReciptId = `card-${newCard.number.slice(-4)}`;
    } else if (selectedCard !== null) {
      paymentMethod = 'online';
      paymentReciptId = `card-${cards[selectedCard].number.slice(-4)}`;
    } else {
      setError('Please select a card or add a new one.');
      return;
    }
    // Prepare order payload
    const orderPayload = {
      orderItems: cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        color: item.color,
        size: item.size
      })),
      shippingAddress: selectedAddress._id,
      totalPrice: cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
      paymentMethod,
      paymentReciptId
    };
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/order', orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optionally clear cart here (if you have an endpoint)
      await axios.delete('http://localhost:3000/cart/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
      navigate('/order-success');
    } catch (err) {
      setError('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-4 py-10">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-8 text-white">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-fuchsia-500 to-purple-400 text-transparent bg-clip-text">Checkout</h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select Shipping Address</h3>
          <div className="space-y-3">
            {addresses.length === 0 && (
              <div className="text-gray-400 text-sm">No saved addresses found.</div>
            )}
            {addresses.map((addr, idx) => (
              <div
                key={addr._id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedAddress && selectedAddress._id === addr._id ? 'border-fuchsia-500 bg-fuchsia-50 dark:bg-gray-800' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'} text-black dark:text-white`}
                onClick={() => setSelectedAddress(addr)}
              >
                <div className="flex-1">
                  <div className="font-semibold">{addr.type} Address</div>
                  <div className="text-xs text-gray-500">{addr.street}, {addr.city}, {addr.state} - {addr.pin}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select a Payment Card</h3>
          <div className="space-y-3">
            {cards.length === 0 && (
              <div className="text-gray-400 text-sm">No saved cards found.</div>
            )}
            {cards.map((card, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedCard === idx ? 'border-fuchsia-500 bg-fuchsia-50 dark:bg-gray-800' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'} text-black dark:text-white`}
                onClick={() => handleCardSelect(idx)}
              >
                <FaCreditCard className="text-fuchsia-500" />
                <div className="flex-1">
                  <div className="font-semibold">**** **** **** {card.number.slice(-4)}</div>
                  <div className="text-xs text-gray-500">Exp: {card.expiry} | {card.name}</div>
                </div>
              </div>
            ))}
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-fuchsia-400 text-fuchsia-700 dark:text-fuchsia-300 bg-fuchsia-50 dark:bg-gray-800 hover:bg-fuchsia-100 dark:hover:bg-gray-700 transition w-full mt-2`}
              onClick={() => { setShowNewCard(true); setSelectedCard(null); }}
              type="button"
            >
              <FaPlus /> Add New Card
            </button>
          </div>
        </div>
        {showNewCard && (
          <div className="mb-6 animate-fade-in">
            <h3 className="text-lg font-semibold mb-2">Enter New Card Details</h3>
            <div className="space-y-3">
              <input
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                type="text"
                name="number"
                placeholder="Card Number (16 digits)"
                maxLength={16}
                value={newCard.number}
                onChange={handleNewCardChange}
              />
              <input
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                type="text"
                name="name"
                placeholder="Name on Card"
                value={newCard.name}
                onChange={handleNewCardChange}
              />
              <div className="flex gap-3">
                <input
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={newCard.expiry}
                  onChange={handleNewCardChange}
                />
                <input
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                  type="password"
                  name="cvv"
                  placeholder="CVV"
                  maxLength={3}
                  value={newCard.cvv}
                  onChange={handleNewCardChange}
                />
              </div>
            </div>
          </div>
        )}
        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
        <button
          className="w-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:scale-105 transition mt-2"
          onClick={handleProceed}
        >
          Proceed to Buy
        </button>
      </div>
    </div>
  );
};

export default Checkout; 