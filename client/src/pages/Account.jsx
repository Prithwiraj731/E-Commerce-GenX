import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function Account() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Address form initial state
  const initialAddressState = { pin: '', city: '', state: '', street: '', type: '' };
  const [addressForm, setAddressForm] = useState(initialAddressState);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Card form initial state
  const initialCardState = { number: '', expiryDate: '', cvv: '' };
  const [cardForm, setCardForm] = useState(initialCardState);
  const [editingCardId, setEditingCardId] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [cardError, setCardError] = useState(null);

  const [orders, setOrders] = useState([]);

  // --- NEW: Logout Function ---
  const handleLogout = () => {
    // Optional: Ask for user confirmation
    if (window.confirm('Are you sure you want to log out?')) {
      // 1. Remove the authentication token from storage
      localStorage.removeItem('token');
      // 2. Navigate the user back to the login page
      navigate('/login');
    }
  };

  // Helper: Auth config
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchAllUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          navigate('/login');
          return;
        }

        const authConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const profilePromise = axios.get('http://localhost:3000/user/profile', authConfig);
        const addressPromise = axios.get('http://localhost:3000/user/address', authConfig);
        const cardPromise = axios.get('http://localhost:3000/user/card', authConfig);
        const orderPromise = axios.get('http://localhost:3000/order', authConfig);

        const [profileResponse, addressResponse, cardResponse, orderResponse] = await Promise.all([
          profilePromise,
          addressPromise,
          cardPromise,
          orderPromise,
        ]);

        const combinedData = {
          ...profileResponse.data.user,
          address: addressResponse.data.addresses || [],
          paymentCards: cardResponse.data.cards || [],
        };

        setUserData(combinedData);
        setOrders(orderResponse.data.data || []);
        // Store user name in localStorage for use on Home page
        if (combinedData.name) {
          localStorage.setItem('userName', combinedData.name);
        }

      } catch (err) {
        console.error('Error fetching account data:', err);
        setError('Failed to load your account. Please try logging in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchAllUserData();
  }, [navigate]);

  // Add or update address
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressLoading(true);
    setAddressError(null);
    try {
      if (editingAddressId) {
        // Update
        const res = await axios.put(
          `http://localhost:3000/user/address/${editingAddressId}`,
          addressForm,
          getAuthConfig()
        );
        setUserData((prev) => ({
          ...prev,
          address: prev.address.map((a) => (a._id === editingAddressId ? res.data.address : a)),
        }));
        setEditingAddressId(null);
      } else {
        // Add
        const res = await axios.post(
          'http://localhost:3000/user/address',
          addressForm,
          getAuthConfig()
        );
        setUserData((prev) => ({ ...prev, address: [...prev.address, res.data.address] }));
      }
      setAddressForm(initialAddressState);
      setShowAddressForm(false);
    } catch (err) {
      setAddressError('Failed to save address.');
    } finally {
      setAddressLoading(false);
    }
  };

  // Edit address
  const handleEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      pin: addr.pin || '',
      city: addr.city || '',
      state: addr.state || '',
      street: addr.street || '',
      type: addr.type || '',
    });
    setShowAddressForm(true);
  };

  // Delete address
  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    setAddressLoading(true);
    setAddressError(null);
    try {
      await axios.delete(`http://localhost:3000/user/address/${id}`, getAuthConfig());
      setUserData((prev) => ({ ...prev, address: prev.address.filter((a) => a._id !== id) }));
      if (editingAddressId === id) {
        setEditingAddressId(null);
        setAddressForm(initialAddressState);
        setShowAddressForm(false);
      }
    } catch (err) {
      setAddressError('Failed to delete address.');
    } finally {
      setAddressLoading(false);
    }
  };

  // Add or update card
  const handleCardSubmit = async (e) => {
    e.preventDefault();
    setCardLoading(true);
    setCardError(null);
    try {
      if (editingCardId) {
        // Update
        const res = await axios.put(
          `http://localhost:3000/user/card/${editingCardId}`,
          cardForm,
          getAuthConfig()
        );
        setUserData((prev) => ({
          ...prev,
          paymentCards: prev.paymentCards.map((c) => (c._id === editingCardId ? res.data.card : c)),
        }));
        setEditingCardId(null);
      } else {
        // Add
        const res = await axios.post(
          'http://localhost:3000/user/card',
          cardForm,
          getAuthConfig()
        );
        setUserData((prev) => ({ ...prev, paymentCards: [...prev.paymentCards, res.data.card] }));
      }
      setCardForm(initialCardState);
      setShowCardForm(false);
    } catch (err) {
      setCardError('Failed to save card.');
    } finally {
      setCardLoading(false);
    }
  };

  // Edit card
  const handleEditCard = (card) => {
    setEditingCardId(card._id);
    setCardForm({
      number: card.number || '',
      expiryDate: card.expiryDate || '',
      cvv: card.cvv || '',
    });
    setShowCardForm(true);
  };

  // Delete card
  const handleDeleteCard = async (id) => {
    if (!window.confirm('Delete this card?')) return;
    setCardLoading(true);
    setCardError(null);
    try {
      await axios.delete(`http://localhost:3000/user/card/${id}`, getAuthConfig());
      setUserData((prev) => ({ ...prev, paymentCards: prev.paymentCards.filter((c) => c._id !== id) }));
      if (editingCardId === id) {
        setEditingCardId(null);
        setCardForm(initialCardState);
        setShowCardForm(false);
      }
    } catch (err) {
      setCardError('Failed to delete card.');
    } finally {
      setCardLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex justify-center items-center text-white text-xl">Loading Your Account...</div>;
  if (error) return <div className="min-h-screen bg-black flex justify-center items-center text-red-500 text-xl">{error}</div>;
  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-violet-900 text-white font-sans">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-300 hover:text-white font-semibold p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Back to Home">
                <FaArrowLeft />
            </button>
            <h1 className="text-3xl font-bold text-gray-100">My Account</h1>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
            </button>
        </div>

        {/* Profile Section */}
        <section className="bg-black/30 shadow-2xl rounded-2xl p-6 mb-8 flex items-center gap-6">
          <img src={`https://ui-avatars.com/api/?name=${userData.name.replace(' ', '+')}&background=0D8ABC&color=fff&size=128`} alt="Profile" className="w-24 h-24 rounded-full border-2 border-fuchsia-500 object-cover" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-100">{userData.name}</h2>
            <p className="text-sm text-gray-400">📧 {userData.email}</p>
            <p className="text-sm text-gray-400">📞 {userData.phone}</p>
          </div>
        </section>

        {/* Order History */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Order History</h2>
          <div className="space-y-6">
            {orders.length === 0 ? (
              <p className="p-4 text-gray-500">You have no past orders.</p>
            ) : (
              orders.map(order => (
                <div key={order._id} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Order ID:</span> <span className="font-mono text-sm">{order._id}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Date:</span> {new Date(order.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Status:</span> <span className="capitalize font-bold text-fuchsia-600 dark:text-fuchsia-400">{order.status || 'Placed'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Total:</span> ₹{order.totalPrice}
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                    <h3 className="font-semibold mb-2 text-lg">Items:</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {order.orderItems.map(item => (
                        <div key={item._id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                          <img src={item.product?.image || '/no-image.png'} alt={item.product?.name} className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white">{item.product?.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Qty: {item.quantity}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Price: ₹{item.product?.price}</div>
                            {item.size && <div className="text-xs text-gray-500 dark:text-gray-400">Size: {item.size}</div>}
                            {item.color && <div className="text-xs text-gray-500 dark:text-gray-400">Color: {item.color}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Saved Cards */}
        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-200 flex items-center gap-4">
                Saved Cards
                {!showCardForm && !editingCardId && (
                    <button
                        className="ml-auto bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded shadow transition-all text-sm"
                        onClick={() => { setShowCardForm(true); setEditingCardId(null); setCardForm(initialCardState); }}
                    >
                        + Add Card
                    </button>
                )}
            </h2>
            {/* Card Form - only show when adding or editing */}
            {(showCardForm || editingCardId) && (
                <form onSubmit={handleCardSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border border-blue-100">
                    <input
                        type="text"
                        placeholder="Card Number (16 digits)"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                        value={cardForm.number}
                        onChange={e => setCardForm({ ...cardForm, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                        required
                        pattern="\d{16}"
                    />
                    <input
                        type="text"
                        placeholder="Expiry Date (MM/YY)"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                        value={cardForm.expiryDate}
                        onChange={e => setCardForm({ ...cardForm, expiryDate: e.target.value })}
                        required
                        pattern="^(0[1-9]|1[0-2])\/\d{2}$"
                    />
                    <input
                        type="password"
                        placeholder="CVV (3 digits)"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                        value={cardForm.cvv}
                        onChange={e => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                        required
                        pattern="\d{3}"
                    />
                    <div className="col-span-1 md:col-span-2 flex gap-2 mt-2">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition-all"
                            disabled={cardLoading}
                        >
                            {editingCardId ? 'Update Card' : 'Add Card'}
                        </button>
                        <button
                            type="button"
                            className="bg-gray-400 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-all"
                            onClick={() => { setEditingCardId(null); setCardForm(initialCardState); setShowCardForm(false); }}
                        >
                            Cancel
                        </button>
                    </div>
                    {cardError && <div className="col-span-2 text-red-600">{cardError}</div>}
                </form>
            )}
            <div className="grid md:grid-cols-2 gap-4">
                {userData.paymentCards.length > 0 ? (
                    userData.paymentCards.map((card) => (
                        <div key={card._id} className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 relative border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-fuchsia-500 transition-all">
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold"
                                    onClick={() => handleEditCard(card)}
                                >Edit</button>
                                <button
                                    className="text-red-600 dark:text-red-400 hover:underline text-sm font-semibold"
                                    onClick={() => handleDeleteCard(card._id)}
                                >Delete</button>
                            </div>
                            <p className="font-mono text-lg tracking-wider mb-1 text-gray-900 dark:text-white">
                                •••• •••• •••• <span className="font-bold text-xl text-gray-900 dark:text-white">{card.number ? card.number.slice(-4) : ''}</span>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Expiry: {card.expiryDate}</p>
                        </div>
                    ))
                ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 text-gray-500 dark:text-gray-400">You have no saved cards.</div>
                )}
            </div>
        </section>

        {/* Saved Addresses */}
        <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-200 flex items-center gap-4">
                Saved Addresses
                {!showAddressForm && !editingAddressId && (
                    <button
                        className="ml-auto bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded shadow transition-all text-sm"
                        onClick={() => { setShowAddressForm(true); setEditingAddressId(null); setAddressForm(initialAddressState); }}
                    >
                        + Add Address
                    </button>
                )}
            </h2>
            {/* Address Form - only show when adding or editing */}
            {(showAddressForm || editingAddressId) && (
                <form onSubmit={handleAddressSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border border-blue-100">
                    <input
                        type="text"
                        placeholder="Street"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                        value={addressForm.street}
                        onChange={e => setAddressForm({ ...addressForm, street: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="City"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                        value={addressForm.city}
                        onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="State"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                        value={addressForm.state}
                        onChange={e => setAddressForm({ ...addressForm, state: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Pin Code"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                        value={addressForm.pin}
                        onChange={e => setAddressForm({ ...addressForm, pin: e.target.value })}
                        required
                    />
                    <select
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                        value={addressForm.type}
                        onChange={e => setAddressForm({ ...addressForm, type: e.target.value })}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                    </select>
                    <div className="col-span-1 md:col-span-2 flex gap-2 mt-2">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition-all"
                            disabled={addressLoading}
                        >
                            {editingAddressId ? 'Update Address' : 'Add Address'}
                        </button>
                        <button
                            type="button"
                            className="bg-gray-400 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-all"
                            onClick={() => { setEditingAddressId(null); setAddressForm(initialAddressState); setShowAddressForm(false); }}
                        >
                            Cancel
                        </button>
                    </div>
                    {addressError && <div className="col-span-2 text-red-600">{addressError}</div>}
                </form>
            )}
            <div className="grid md:grid-cols-2 gap-4">
                {userData.address.length > 0 ? (
                    userData.address.map((addr) => (
                        <div key={addr._id} className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 relative border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-fuchsia-500 transition-all">
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold"
                                    onClick={() => handleEditAddress(addr)}
                                >Edit</button>
                                <button
                                    className="text-red-600 dark:text-red-400 hover:underline text-sm font-semibold"
                                    onClick={() => handleDeleteAddress(addr._id)}
                                >Delete</button>
                            </div>
                            <p className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{addr.type} Address</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{addr.street}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{addr.city}, {addr.state} - {addr.pin}</p>
                        </div>
                    ))
                ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 text-gray-500 dark:text-gray-400">You have no saved addresses.</div>
                )}
            </div>
        </section>

        <div className="flex justify-end mb-6">
        </div>
      </div>
    </div>
  );
}

export default Account;