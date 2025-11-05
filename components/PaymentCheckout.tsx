import React, { useState } from 'react';
import { ICONS } from '../constants';
import { Page } from '../types';

interface PaymentCheckoutProps {
  navigate: (page: Page) => void;
}

const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({ navigate }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [isBusinessPurchase, setIsBusinessPurchase] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    country: 'United States of America',
    state: 'Alabama',
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
    couponCode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment submission logic here
    console.log('Payment submitted:', formData);
    alert('Payment processing... This is a demo.');
  };

  const productPrice = 32.39;
  const salesTax = 2.40;
  const totalPrice = productPrice + salesTax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Logo */}
        <div className="mb-8 flex items-center justify-between">
          <button 
            onClick={() => navigate('home')}
            className="flex items-center gap-3 group"
          >
            <img src="/logo.png" alt="Gentle Omega AI Logo" className="h-10 w-10 object-contain" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">Gentle <span className="text-cyan-500">Ω</span>mega AI</h1>
              <p className="text-xs text-gray-600">Secure Payment Checkout</p>
            </div>
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold">Currency:</span>
            <span className="font-bold text-gray-900">USD</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Billing Information & Payment Method */}
          <div className="lg:col-span-2 space-y-6">
            {/* Billing Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-bold text-gray-900">Billing information</h2>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div className="space-y-4">
                {/* Business Purchase Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="businessPurchase"
                    checked={isBusinessPurchase}
                    onChange={(e) => setIsBusinessPurchase(e.target.checked)}
                    className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500"
                  />
                  <label htmlFor="businessPurchase" className="text-sm text-gray-700">
                    Business purchase
                  </label>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      E-mail *
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        First name *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Last name *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Country
                    </span>
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option>United States of America</option>
                    <option>Pakistan</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                  </select>
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      State
                    </span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option>Alabama</option>
                    <option>Alaska</option>
                    <option>California</option>
                    <option>New York</option>
                    <option>Texas</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>

              {/* Payment Method Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`relative p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === 'card'
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {paymentMethod === 'card' && (
                    <div className="absolute top-2 right-2">
                      <svg className="w-6 h-6 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-8 w-12" viewBox="0 0 48 32" fill="none">
                      <rect width="48" height="32" rx="4" fill="#1434CB"/>
                      <path d="M16 10h16v12H16z" fill="#EB001B"/>
                      <path d="M20 16a8 8 0 0116 0 8 8 0 01-16 0z" fill="#FF5F00"/>
                    </svg>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`relative p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {paymentMethod === 'paypal' && (
                    <div className="absolute top-2 right-2">
                      <svg className="w-6 h-6 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <div className="flex items-center justify-center">
                    <svg className="h-8" viewBox="0 0 100 32" fill="none">
                      <path d="M12 4h14c4 0 7 3 7 7s-3 7-7 7h-7l-2 10H12l5-24z" fill="#003087"/>
                      <path d="M26 11h14c4 0 7 3 7 7s-3 7-7 7h-7l-2 10H26l5-24z" fill="#009cde"/>
                    </svg>
                  </div>
                </button>
              </div>

              {/* Card Details Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Card number *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Expiration Date & Security Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Expiration date *
                        </span>
                      </label>
                      <input
                        type="text"
                        name="expirationDate"
                        value={formData.expirationDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Security code*
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="securityCode"
                          value={formData.securityCode}
                          onChange={handleInputChange}
                          placeholder="CVV"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                          required
                        />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PayPal Message */}
              {paymentMethod === 'paypal' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-800">
                    You will be redirected to PayPal to complete your payment securely.
                  </p>
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600 leading-relaxed">
              <p>
                By submitting your Order, you acknowledge that you are purchasing from Gentle Ω mega AI, an authorized e-Commerce platform. 
                Once the transaction is complete, your contact information will be shared with our support team for ongoing support purposes 
                for online payment related issues. Do not hesitate to contact our CUSTOMER CARE CENTER for more information about payment 
                and delivery. Please state the order ID from the confirmation email as a reference so that we can assist you efficiently.
              </p>
              <p className="mt-2">© Gentle Ω mega AI 2025</p>
              <div className="mt-2 flex gap-4">
                <a href="#" className="text-cyan-600 hover:text-cyan-700">Privacy Policy</a>
                <a href="#" className="text-cyan-600 hover:text-cyan-700">Terms and Conditions</a>
                <a href="#" className="text-cyan-600 hover:text-cyan-700">Refund Policy</a>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">You're buying</h2>

              {/* Product Card */}
              <div className="mb-6">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img src="/logo.svg" alt="Gentle Omega AI Logo" className="h-12 w-12 brightness-0 invert" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">AI Career Slot</h3>
                    <p className="text-xs text-cyan-600 font-medium mt-1">Auto-renewal</p>
                    <p className="text-sm text-gray-600 mt-1">32.39 USD/per 1 Month</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    Sales Tax (8.00%):
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span className="font-medium text-gray-900">{salesTax.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-900 pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">TOTAL:</span>
                  <span className="text-2xl font-bold text-gray-900">{totalPrice.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleInputChange}
                    placeholder="Coupon Code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                  />
                  <button
                    type="button"
                    className="px-6 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-bold text-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Submit order
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1434CB">
                      <rect width="24" height="16" rx="2" fill="#1434CB"/>
                    </svg>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="#EB001B"/>
                      <circle cx="16" cy="12" r="10" fill="#F79E1B" opacity="0.8"/>
                    </svg>
                    <span className="text-[10px] font-medium">SECURE PAYMENTS</span>
                  </div>
                  <div className="flex items-center justify-center text-xs">
                    <svg className="w-16 h-6" viewBox="0 0 64 24" fill="none">
                      <rect width="64" height="24" rx="2" fill="#00C851"/>
                      <text x="32" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">SSL</text>
                    </svg>
                  </div>
                  <div className="flex items-center justify-center col-span-2 gap-2">
                    <div className="text-[10px] font-medium text-gray-600 flex items-center gap-1">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>TrustedSite</span>
                    </div>
                    <div className="text-[10px] font-medium text-gray-600 flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Norton Secured</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
