import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';
import { generateChatResponse } from '../services/openaiService';

const { FiSend, FiMessageSquare, FiX, FiLoader, FiMaximize2, FiMinimize2 } = FiIcons;

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your GalaGram AI travel assistant. I can help you plan your trip, suggest destinations, and answer questions about the Philippines. How can I help you today?'
    }
  ]);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Load chat history from localStorage 
  useEffect(() => {
    const savedChat = localStorage.getItem('galagram_chat_history');
    if (savedChat) {
      try {
        const parsedChat = JSON.parse(savedChat);
        if (Array.isArray(parsedChat) && parsedChat.length > 0) {
          setChatHistory(parsedChat);
        }
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('galagram_chat_history', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const userMessage = message.trim();
    setMessage('');
    
    // Add user message to chat
    const updatedHistory = [
      ...chatHistory,
      { role: 'user', content: userMessage }
    ];
    setChatHistory(updatedHistory);
    setIsLoading(true);
    
    try {
      // Create a system message for travel assistant context
      const messagesWithSystem = [
        {
          role: 'system',
          content: `You are a helpful travel assistant for GalaGram, a travel app focused on the Philippines.
          Provide concise, accurate information about Philippine destinations, cuisine, culture, and travel tips.
          Be friendly and conversational. If asked about destinations outside the Philippines, politely redirect 
          to Philippine travel topics. Keep responses under 250 words. Include practical tips when relevant.`
        },
        ...updatedHistory
      ];
      
      // Get response from OpenAI service
      const aiResponse = await generateChatResponse(messagesWithSystem);
      
      setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    const initialMessage = {
      role: 'assistant',
      content: 'Hi! I\'m your GalaGram AI travel assistant. I can help you plan your trip, suggest destinations, and answer questions about the Philippines. How can I help you today?'
    };
    setChatHistory([initialMessage]);
    localStorage.setItem('galagram_chat_history', JSON.stringify([initialMessage]));
    toast.success('Chat history cleared');
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <SafeIcon icon={FiMessageSquare} className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className={`fixed ${isExpanded ? 'inset-4' : 'bottom-4 right-4 w-96'} bg-white rounded-lg shadow-2xl z-50 flex flex-col transition-all duration-300`}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Travel Assistant</h3>
                  <p className="text-xs text-gray-500">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearChat}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Clear chat history"
                >
                  <SafeIcon icon={FiX} className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <SafeIcon icon={isExpanded ? FiMinimize2 : FiMaximize2} className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ maxHeight: isExpanded ? 'none' : '400px' }}
            >
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      chat.role === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{chat.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <SafeIcon icon={FiLoader} className="w-5 h-5 animate-spin text-purple-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about travel in the Philippines..."
                  className="flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="1"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !message.trim()}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-3 rounded-lg disabled:opacity-50"
                >
                  <SafeIcon icon={FiSend} className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift + Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;