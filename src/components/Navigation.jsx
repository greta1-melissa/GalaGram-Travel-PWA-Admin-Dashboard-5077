import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiSearch, FiMap, FiCalendar, FiStar } = FiIcons;

const Navigation = () => {
  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/search', label: 'Search', icon: FiSearch },
    { path: '/destinations', label: 'Destinations', icon: FiMap },
    { path: '/itinerary', label: 'Itinerary', icon: FiCalendar },
    { path: '/reviews', label: 'Reviews', icon: FiStar }
  ];

  return (
    <motion.nav 
      className="glass-effect sticky top-16 z-40 px-4 py-2"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="container mx-auto">
        <div className="flex justify-center space-x-1 sm:space-x-4">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/20'
                  }`
                }
              >
                <SafeIcon icon={item.icon} className="w-4 h-4" />
                <span className="hidden sm:block">{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;