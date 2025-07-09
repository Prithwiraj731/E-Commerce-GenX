import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaUserCircle, FaMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FAQ = [
  {
    q: 'What is Lunaria?',
    a: 'Lunaria is your one-stop shop for the latest fashion and tech at unbeatable prices!'
  },
  {
    q: 'How do I track my order?',
    a: 'After placing an order, you can track it from your account dashboard under "My Orders".'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept credit/debit cards, UPI, and net banking.'
  },
  {
    q: 'How do I contact support?',
    a: 'You can reach our support team via the Contact Us page or by emailing support@lunaria.com.'
  },
  {
    q: 'Can I return or exchange products?',
    a: 'Yes! We offer easy returns and exchanges within 7 days of delivery.'
  },
  {
    q: 'How do I become a reseller?',
    a: 'Sign up and click on "Join Now" on the homepage to start your reselling journey!'
  },
];

const SUGGESTED_QUESTIONS = [
  'What is Lunaria?',
  'How do I track my order?',
  'What payment methods do you accept?',
  'Can I return or exchange products?',
  'How do I become a reseller?',
  'How do I contact support?'
];
const FUN_FACTS = [
  "Did you know? You can track your order from your account dashboard!",
  "Tip: Use the search bar to quickly find your favorite products.",
  "We offer easy returns within 7 days of delivery!",
  "You can become a reseller and earn with Lunaria!",
  "Your payment details are always secure with us.",
  "Check out our latest arrivals in the Products section!"
];

// Helper: extract keywords from a string (remove stopwords, punctuation, lowercase)
const STOPWORDS = ['what', 'is', 'do', 'how', 'i', 'a', 'the', 'of', 'to', 'in', 'on', 'for', 'can', 'you', 'your', 'my', 'we', 'our', 'and', 'or', 'by', 'with', 'at', 'from', 'as', 'an'];
// Synonym map for FAQ keyword matching
const KEYWORD_SYNONYMS = {
  methods: ['options', 'ways', 'types'],
  accept: ['support', 'allow', 'use'],
  payment: ['pay', 'payments'],
  order: ['orders', 'purchase', 'buy'],
  track: ['tracking', 'status', 'follow'],
  return: ['returns', 'refund', 'exchange'],
  exchange: ['swap', 'replace'],
  contact: ['support', 'help', 'customer'],
  reseller: ['seller', 'partner'],
  product: ['products', 'item', 'goods'],
};

function expandWithSynonyms(word) {
  return [word, ...(KEYWORD_SYNONYMS[word] || [])];
}

function extractKeywords(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .split(' ')
    .filter(word => word && !STOPWORDS.includes(word));
}

function keywordMatch(userKeywords, faqKeywords) {
  let matchCount = 0;
  for (const kw of faqKeywords) {
    const allVariants = expandWithSynonyms(kw);
    if (userKeywords.some(ukw => allVariants.includes(ukw))) {
      matchCount++;
    }
  }
  // If FAQ is short (<=2 keywords), require all; else, at least 2 matches
  return faqKeywords.length <= 2 ? matchCount === faqKeywords.length : matchCount >= 2;
}

function getBotResponse(userMsg) {
  const msg = userMsg.toLowerCase();
  // Small talk and common questions
  if (["hi", "hello", "hey", "yo", "hola"].some(greet => msg.includes(greet))) return 'Hello! How can I help you today?';
  if (msg.includes('how are you')) return "I'm just code, but I'm here to help you!";
  if (msg.includes('your name')) return "I'm Luna, your virtual assistant.";
  if (msg.includes('who made you')) return "I was created by the Lunaria team to help you!";
  if (msg.includes('thank')) return "You're welcome! 😊";
  if (msg.includes('bye')) return "Goodbye! Have a great day!";
  // FAQ matching (flexible, with synonyms)
  const userKeywords = extractKeywords(userMsg);
  for (const { q, a } of FAQ) {
    const faqKeywords = extractKeywords(q);
    if (faqKeywords.length > 0 && keywordMatch(userKeywords, faqKeywords)) {
      return a;
    }
  }
  return {
    text: "Sorry, I didn't understand that. Try asking about orders, payment, returns, or support.",
    suggest: true
  };
}

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I am Luna, your virtual assistant. How can I help you?' }
  ]);
  const [typing, setTyping] = useState(false);
  const [idleTip, setIdleTip] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const idleTimer = useRef(null);
  const navigate = useNavigate();

  // Animate scroll to bottom
  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, typing]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open, minimized]);

  // Idle fun fact/tip
  useEffect(() => {
    if (!open || minimized) return;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setIdleTip(FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]);
    }, 30000); // 30s
    return () => clearTimeout(idleTimer.current);
  }, [messages, open, minimized]);

  // Esc to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open]);

  const handleSend = (msgOverride) => {
    const userMsg = (msgOverride !== undefined ? msgOverride : input).trim();
    if (!userMsg) return;
    setMessages(msgs => [...msgs, { from: 'user', text: userMsg }]);
    setTyping(true);
    setIdleTip(null);
    setTimeout(() => {
      const botReply = getBotResponse(userMsg);
      if (typeof botReply === 'string') {
        setMessages(msgs => [...msgs, { from: 'bot', text: botReply }]);
      } else {
        setMessages(msgs => [...msgs, { from: 'bot', text: botReply.text, suggest: botReply.suggest }]);
      }
      setTyping(false);
    }, 800);
    setInput('');
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') handleSend();
  };

  const handleClear = () => {
    setMessages([{ from: 'bot', text: 'Hi! I am Luna, your virtual assistant. How can I help you?' }]);
    setIdleTip(null);
  };

  if (!open) {
    return (
      <button
        className="fixed z-50 bottom-28 right-8 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all flex items-center justify-center animate-pulse"
        onClick={() => { setOpen(true); setMinimized(false); }}
        title="Chat with us!"
      >
        <FaRobot size={28} />
      </button>
    );
  }

  if (minimized) {
    return (
      <button
        className="fixed z-50 bottom-28 right-8 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all flex items-center justify-center"
        onClick={() => setMinimized(false)}
        title="Open chat"
      >
        <FaRobot size={24} />
      </button>
    );
  }

  return (
    <div className="fixed z-50 bottom-28 right-8 w-80 max-w-[90vw] max-h-[70vh] bg-white dark:bg-gray-900 border border-fuchsia-400 rounded-2xl shadow-2xl flex flex-col transition-all animate-fade-in" style={{ minHeight: 420 }}>
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-fuchsia-600 to-indigo-600 rounded-t-2xl sticky top-0 z-10">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <FaRobot /> Luna
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMinimized(true)} className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 rounded-full p-1" title="Minimize chat"><FaMinus size={16} /></button>
          <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 rounded-full p-1" title="Close chat"><FaTimes size={18} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-gradient-to-br from-white via-fuchsia-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" style={{ minHeight: 0 }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}>
            {msg.from === 'bot' && <FaRobot className="text-fuchsia-500 bg-white dark:bg-gray-800 rounded-full p-1 mr-1" size={28} />}
            <div className={`px-3 py-2 rounded-lg max-w-[80%] text-sm shadow ${msg.from === 'user' ? 'bg-fuchsia-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
              {msg.text}
              {msg.suggest && (
                <div className="mt-2 text-xs text-fuchsia-400">Try clicking a suggested question below!</div>
              )}
            </div>
            {msg.from === 'user' && <FaUserCircle className="text-fuchsia-400 bg-white dark:bg-gray-800 rounded-full ml-1" size={28} />}
          </div>
        ))}
        {typing && (
          <div className="flex items-end gap-2 justify-start animate-fade-in">
            <FaRobot className="text-fuchsia-500 bg-white dark:bg-gray-800 rounded-full p-1 mr-1" size={28} />
            <div className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white max-w-[80%] text-sm shadow animate-pulse">Luna is typing...</div>
          </div>
        )}
        {idleTip && (
          <div className="flex items-end gap-2 justify-start animate-fade-in">
            <FaRobot className="text-fuchsia-500 bg-white dark:bg-gray-800 rounded-full p-1 mr-1" size={28} />
            <div className="px-3 py-2 rounded-lg bg-indigo-100 dark:bg-gray-700 text-indigo-900 dark:text-indigo-200 max-w-[80%] text-xs shadow animate-fade-in">{idleTip}</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {/* Suggested Questions */}
      <div className="flex flex-wrap gap-2 px-3 pb-2 bg-white dark:bg-gray-900 border-t border-b dark:border-gray-800 sticky bottom-0 z-10">
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            className="bg-fuchsia-100 dark:bg-gray-800 text-fuchsia-700 dark:text-fuchsia-300 px-3 py-1 rounded-full text-xs font-medium shadow hover:bg-fuchsia-200 dark:hover:bg-gray-700 transition"
            onClick={() => handleSend(q)}
          >
            {q}
          </button>
        ))}
        <button
          className="bg-indigo-100 dark:bg-gray-800 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-medium shadow hover:bg-indigo-200 dark:hover:bg-gray-700 transition ml-auto"
          onClick={() => navigate('/contact')}
        >
          Contact Support
        </button>
        <button
          className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          onClick={handleClear}
        >
          Clear Chat
        </button>
      </div>
      <div className="flex items-center gap-2 p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-2xl">
        <input
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          autoFocus
        />
        <button
          className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white p-2 rounded-full transition"
          onClick={() => handleSend()}
          title="Send"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

// Animations (add to your global CSS or Tailwind config):
// .animate-fade-in { animation: fadeIn 0.4s; }
// .animate-slide-in { animation: slideIn 0.3s; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: none; opacity: 1; } } 