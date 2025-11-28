/**
 * GentleOmega AI - Live Chat Widget
 * Only accessible to authenticated users
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { sendWhatsAppMessage } from '../utils/whatsapp-service';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  category?: string;
}

interface ChatWidgetProps {
  onClose?: () => void;
}

const SUPPORT_CATEGORIES = [
  { value: 'customer-service', label: 'Customer Service', icon: '🎧' },
  { value: 'booking', label: 'Order/Booking Issues', icon: '📦' },
  { value: 'technical', label: 'Technical Support', icon: '🔧' },
  { value: 'billing', label: 'Billing Questions', icon: '💳' },
  { value: 'general', label: 'General Inquiry', icon: '💬' }
];

const ChatWidget: React.FC<ChatWidgetProps> = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message when chat opens
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: 'Greetings, welcome to GentleΩmega Holdings.\n\nHow may I assist you today?',
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      category: selectedCategory
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Forward to WhatsApp Business
    try {
      const categoryLabel = SUPPORT_CATEGORIES.find(c => c.value === selectedCategory)?.label;
      const whatsappMessage = `📩 New Chat Message\n\n` +
        `👤 User: ${currentUser.displayName || currentUser.email}\n` +
        `📧 Email: ${currentUser.email}\n` +
        `📁 Category: ${categoryLabel}\n\n` +
        `💬 Message:\n${inputMessage}`;

      await sendWhatsAppMessage('+923108537693', whatsappMessage);

      // Auto-reply
      setTimeout(() => {
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thank you for your message! Our team has been notified and will respond shortly. You can also reach us on WhatsApp at +92 310 853 7693.',
          sender: 'agent',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, autoReply]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Floating chat button
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => currentUser ? setIsOpen(true) : alert('Please login to chat')}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-cyan-500/50 transition-all"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </motion.button>
    );
  }

  // Chat window
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          height: isMinimized ? 'auto' : '600px'
        }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 ${isMinimized ? '' : 'h-[600px]'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 flex items-center justify-between cursor-pointer"
             onClick={() => isMinimized && setIsMinimized(false)}
        >
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="GentleOmega Logo" className="w-10 h-10 rounded-full bg-white p-1" />
            <div>
              <h3 className="text-white font-bold text-lg">GentleΩmega Support</h3>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Online</span>
                <span className="mx-1">•</span>
                <span>📞 +1 920 806 6680</span>
              </div>
            </div>
          </div>
          
          {/* Minimize/Maximize Button */}
          <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="text-white hover:text-gray-200 transition-colors"
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMinimized ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              )}
            </svg>
          </button>
          
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="text-white hover:text-gray-200 transition-colors"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          </div>
        </div>

        {/* Messages */}
        {!isMinimized && (
          <>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 shadow-md rounded-bl-none border border-gray-200'
                }`}
              >
                {msg.sender === 'agent' && (
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/logo.png" alt="Agent" className="w-6 h-6 rounded-full" />
                    <span className="text-xs font-semibold text-gray-600">Support Agent</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <span className={`text-xs mt-1 block ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-200">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="Agent" className="w-6 h-6 rounded-full" />
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          {/* Category Selector */}
          <div className="mb-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border-2 border-cyan-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 bg-white text-gray-800 font-medium cursor-pointer hover:border-cyan-600 transition-colors"
            >
              {SUPPORT_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value} className="text-gray-800 py-2">
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
        </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatWidget;
