import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { usePWA } from '../contexts/PWAContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiMenu, FiX, FiUser, FiLogOut, FiWifi, FiWifiOff, FiSettings, FiHeart, FiBell, FiMoon, FiSun } = FiIcons;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Welcome to GalaGram!',
      message: 'Explore the beautiful destinations of the Philippines.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 2,
      title: 'New Feature Available',
      message: 'You can now save your favorite destinations.',
      time: '1 day ago',
      read: true
    }
  ]);
  
  const { user, logout } = useAuth();
  const { isOnline } = usePWA();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Close menus when location changes
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
  }, [location]);

  useEffect(() => {
    // Check for dark mode preference
    const darkModePreference = localStorage.getItem('galagram_dark_mode') === 'true';
    setIsDarkMode(darkModePreference);
    
    if (darkModePreference) {
      document.documentElement.classList.add('dark-mode');
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    toast.success('You have been logged out successfully');
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('galagram_dark_mode', newMode.toString());
    
    if (newMode) {
      document.documentElement.classList.add('dark-mode');
      toast.success('Dark mode activated');
    } else {
      document.documentElement.classList.remove('dark-mode');
      toast.success('Light mode activated');
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({
      ...notif,
      read: true
    }));
    setNotifications(updatedNotifications);
    toast.success('All notifications marked as read');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.header 
      className="glass-effect sticky top-0 z-50 px-4 py-3"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">GalaGram</h1>
            <p className="text-xs text-gray-600 hidden sm:block">Eat, Explore, Stay—The Local Way</p>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <SafeIcon 
              icon={isOnline ? FiWifi : FiWifiOff} 
              className={`w-4 h-4 ${isOnline ? 'text-green-500' : 'text-red-500'}`} 
            />
            <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <SafeIcon 
              icon={isDarkMode ? FiSun : FiMoon} 
              className="w-5 h-5 text-gray-700" 
            />
          </button>

          {user ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsMenuOpen(false);
                  }}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors relative"
                >
                  <SafeIcon icon={FiBell} className="w-5 h-5 text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div 
                      className="absolute right-0 mt-2 w-80 glass-effect rounded-lg shadow-lg py-2 z-50"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between px-4 py-2 border-b">
                        <h3 className="font-medium text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllAsRead}
                            className="text-xs text-purple-600 hover:text-purple-800"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(notification => (
                            <div 
                              key={notification.id}
                              className={`px-4 py-3 border-b last:border-b-0 ${!notification.read ? 'bg-purple-50' : ''}`}
                            >
                              <div className="flex justify-between">
                                <h4 className="text-sm font-medium text-gray-800">{notification.title}</h4>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-500 text-sm">
                            No notifications
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                    setIsNotificationsOpen(false);
                  }}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.firstName}
                  </span>
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div 
                      className="absolute right-0 mt-2 w-48 glass-effect rounded-lg shadow-lg py-2"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-800">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-white/20 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <SafeIcon icon={FiUser} className="w-4 h-4 inline mr-2" />
                        Profile
                      </Link>
                      
                      <Link 
                        to="/favorites" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-white/20 transition-colors"
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate('/destinations');
                          toast.success('Your favorites are saved in your profile');
                        }}
                      >
                        <SafeIcon icon={FiHeart} className="w-4 h-4 inline mr-2" />
                        My Favorites
                      </Link>
                      
                      <Link 
                        to="/settings" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-white/20 transition-colors"
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate('/profile');
                          toast.success('Settings are available in your profile');
                        }}
                      >
                        <SafeIcon icon={FiSettings} className="w-4 h-4 inline mr-2" />
                        Settings
                      </Link>
                      
                      <div className="border-t my-1"></div>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-white/20 transition-colors"
                      >
                        <SafeIcon icon={FiLogOut} className="w-4 h-4 inline mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn-primary text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;