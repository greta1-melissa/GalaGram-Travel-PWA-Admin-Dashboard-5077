import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHeart, FiShield, FiEye } = FiIcons;

const Footer = () => {
  return (
    <motion.footer 
      className="glass-effect mt-auto py-6 px-4"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="container mx-auto">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">G</span>
            </div>
            <span className="text-lg font-bold text-gray-800">GalaGram</span>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Eat, Explore, Stay—The Local Way
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiShield} className="w-3 h-3" />
              <span>Private Access Only</span>
            </div>
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiEye} className="w-3 h-3" />
              <span>Hidden from Search Engines</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <Link to="/admin/login" className="hover:text-gray-700 transition-colors">
              Admin Access
            </Link>
            <span>•</span>
            <span>Internal Use Only</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <SafeIcon icon={FiHeart} className="w-3 h-3 text-red-500" />
              <span>for travelers</span>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;