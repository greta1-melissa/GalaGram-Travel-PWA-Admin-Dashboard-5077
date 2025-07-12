import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const { FiMapPin, FiCamera, FiUsers, FiTrendingUp, FiArrowRight, FiX, FiInfo } = FiIcons;

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showInfo, setShowInfo] = useState(false);
  const [featuredDestination, setFeaturedDestination] = useState({
    name: 'Lucban, Quezon',
    description: 'Experience the colorful Pahiyas Festival and taste authentic Filipino cuisine',
    image: 'https://images.pexels.com/photos/2675268/pexels-photo-2675268.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  });

  const features = [
    {
      icon: FiMapPin,
      title: 'Discover Philippines',
      description: 'Find the best restaurants, attractions, and accommodations in any Filipino destination',
      action: () => navigate('/destinations')
    },
    {
      icon: FiCamera,
      title: 'Share Your Journey',
      description: 'Upload and share your travel photos with the GalaGram community',
      action: () => user ? navigate('/profile') : toast.error('Please login to share your journey')
    },
    {
      icon: FiUsers,
      title: 'Connect with Travelers',
      description: 'Meet fellow travelers and share experiences and recommendations',
      action: () => user ? navigate('/reviews') : toast.error('Please login to connect with travelers')
    },
    {
      icon: FiTrendingUp,
      title: 'Smart Recommendations',
      description: 'Get personalized suggestions based on your preferences and travel history',
      action: () => navigate('/search')
    }
  ];

  const handleStartExploring = () => {
    navigate('/search');
    toast.success('Let\'s find your next adventure!');
  };

  const handleJoinCommunity = () => {
    navigate('/register');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          Welcome to <span className="gradient-text">GalaGram</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Eat, Explore, Stay—The Local Way. Your ultimate guide to discovering the Philippines through local experiences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleStartExploring}
            className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiMapPin} className="w-5 h-5" />
            <span>Start Exploring</span>
          </button>
          <button
            onClick={handleJoinCommunity}
            className="text-lg px-8 py-3 inline-flex items-center justify-center space-x-2 border-2 border-purple-500 text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300"
          >
            <SafeIcon icon={FiUsers} className="w-5 h-5 text-purple-600" />
            <span>Join Community</span>
          </button>
        </div>
      </motion.div>

      {/* Featured Destination */}
      <motion.div
        className="glass-effect rounded-lg overflow-hidden mb-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <div className="relative">
          <img
            src={featuredDestination.image}
            alt={featuredDestination.name}
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Featured: {featuredDestination.name}
            </h2>
            <p className="text-white text-opacity-90 mb-4">
              {featuredDestination.description}
            </p>
            <button
              onClick={() => navigate('/destinations')}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white w-fit px-5 py-2 rounded-full flex items-center space-x-2 transition-all"
            >
              <span>Explore Now</span>
              <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="glass-effect p-6 rounded-lg card-hover cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={feature.action}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <SafeIcon icon={feature.icon} className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="glass-effect p-8 rounded-lg text-center relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
        >
          <SafeIcon icon={FiInfo} className="w-5 h-5" />
        </button>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-purple-50 text-purple-800 p-4 rounded-lg mb-6 relative"
            >
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-2 right-2 text-purple-600 hover:text-purple-800"
              >
                <SafeIcon icon={FiX} className="w-4 h-4" />
              </button>
              <p className="text-sm">
                GalaGram is a private travel application designed exclusively for exploring the Philippines. Discover hidden gems, connect with fellow travelers, and create unforgettable journeys.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Ready to Explore the Philippines?
        </h2>
        <p className="text-gray-600 mb-6">
          Join thousands of travelers discovering hidden gems and local favorites across the archipelago.
        </p>
        <button
          onClick={() => navigate('/destinations')}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiMapPin} className="w-5 h-5" />
          <span>Browse Destinations</span>
        </button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="grid grid-cols-3 gap-4 mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {[
          { label: 'Destinations', value: '128+' },
          { label: 'Happy Travelers', value: '5,400+' },
          { label: 'Local Experiences', value: '350+' }
        ].map((stat, index) => (
          <div key={index} className="glass-effect text-center p-4 rounded-lg">
            <p className="text-purple-600 text-xl md:text-2xl font-bold">{stat.value}</p>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;