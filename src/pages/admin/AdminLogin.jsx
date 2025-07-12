import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdmin } from '../../contexts/AdminContext';
import toast from 'react-hot-toast';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiLock, FiEye, FiEyeOff, FiShield } = FiIcons;

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await adminLogin(formData.username, formData.password);
      if (result.success) {
        toast.success('Welcome to GalaGram Admin Console');
        navigate('/admin');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-effect p-8 rounded-lg w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiShield} className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Console</h1>
          <p className="text-gray-200">GalaGram Administration Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pl-12 glass-effect rounded-lg border-0 focus:ring-2 focus:ring-red-500 focus:outline-none text-white placeholder-gray-300"
                placeholder="Enter admin username"
              />
              <SafeIcon icon={FiUser} className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pl-12 pr-12 glass-effect rounded-lg border-0 focus:ring-2 focus:ring-red-500 focus:outline-none text-white placeholder-gray-300"
                placeholder="Enter admin password"
              />
              <SafeIcon icon={FiLock} className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-300 hover:text-white transition-colors"
              >
                <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-red-600 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="loading-spinner w-5 h-5"></div>
            ) : (
              'Access Admin Console'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300 text-sm">
            Default credentials: galagram / admin123
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-300 hover:text-white text-sm"
          >
            Back to GalaGram
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;