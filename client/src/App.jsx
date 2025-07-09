import React from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import Products from './pages/Products'
import Women from './pages/Women'
import Men from './pages/Men'
import Kids from './pages/Kids'
import AdminLogin from './pages/AdminLogin'
import AdminHome from './pages/AdminHome'
import Cart from './pages/Cart'
import Chatbot from './components/common/Chatbot'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import JoinSeller from './pages/JoinSeller'
import Search from './pages/Search'
import PrivacyPolicy from './pages/PrivacyPolicy'
import { UserProvider } from './context/UserContext'

function AppWrapper() {
  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/products' element={<Products />} />
          <Route path='/category/women' element={<Women />} />
          <Route path='/category/men' element={<Men />} />
          <Route path='/category/kids' element={<Kids />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/account' element={<Account />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/home' element={<AdminHome />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/order-success' element={<OrderSuccess />} />
          <Route path='/join-seller' element={<JoinSeller />} />
          <Route path='/search' element={<Search />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <AppWrapper />
        <Footer />
        <Chatbot />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
