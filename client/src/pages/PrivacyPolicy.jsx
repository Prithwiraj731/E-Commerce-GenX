import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-fuchsia-500 drop-shadow-lg">Privacy Policy</h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">Your privacy is important to us. This policy explains how we collect, use, and protect your information when you use our e-commerce platform.</p>
        </div>
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 space-y-8 border border-fuchsia-800/30">
          <div>
            <h2 className="text-2xl font-bold text-fuchsia-400 mb-2">1. Information We Collect</h2>
            <ul className="list-disc list-inside text-gray-300">
              <li>Personal details (name, email, phone, address) provided during registration or checkout.</li>
              <li>Order and payment information for processing your purchases.</li>
              <li>Usage data (pages visited, products viewed, device/browser info).</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-fuchsia-400 mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-300">
              <li>To process orders and deliver products.</li>
              <li>To improve our website, services, and customer experience.</li>
              <li>To send order updates, offers, and important notifications.</li>
              <li>To ensure security and prevent fraud.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-fuchsia-400 mb-2">3. Data Protection</h2>
            <ul className="list-disc list-inside text-gray-300">
              <li>We use industry-standard security measures to protect your data.</li>
              <li>Your payment details are encrypted and never stored on our servers.</li>
              <li>Access to your data is restricted to authorized personnel only.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-fuchsia-400 mb-2">4. Your Rights</h2>
            <ul className="list-disc list-inside text-gray-300">
              <li>You can view, update, or delete your personal information at any time.</li>
              <li>You can opt out of marketing emails via the unsubscribe link.</li>
              <li>Contact us for any privacy-related concerns or requests.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-fuchsia-400 mb-2">5. Changes to This Policy</h2>
            <p className="text-gray-300">We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</p>
          </div>
          <div className="text-center pt-6">
            <span className="text-sm text-gray-400">Effective Date: June 2024</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy; 