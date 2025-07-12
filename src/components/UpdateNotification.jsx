import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../contexts/PWAContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiRefreshCw, FiX } = FiIcons;

const UpdateNotification = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { updateAvailable, reloadApp } = usePWA();

  const handleUpdate = () => {
    reloadApp();
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!updateAvailable || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto"
      >
        <div className="glass-effect p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiRefreshCw} className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Update Available</h3>
                <p className="text-sm text-gray-600">A new version is ready to install</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleUpdate}
              className="flex-1 btn-primary text-sm flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
              <span>Update Now</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateNotification;