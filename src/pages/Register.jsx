import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMail, FiLock, FiEye, FiEyeOff } = FiIcons;

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);
      if (result.success) {
        toast.success('Welcome to GalaGram! Your account has been created.');
        navigate('/');
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
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Join GalaGram</h1>
          <p className="text-gray-200">Create your account and start exploring</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                First Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-12 glass-effect rounded-lg border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-gray-300"
                  placeholder="First name"
                />
                <SafeIcon icon={FiUser} className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Last Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-12 glass-effect rounded-lg border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-gray-300"
                  placeholder="Last name"
                />
                <SafeIcon icon={FiUser} className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pl-12 glass-effect rounded-lg border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-gray-300"
                placeholder="Enter your email"
              />
              <SafeIcon icon={FiMail} className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
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
                className="w-full px-4 py-3 pl-12 pr-12 glass-effect rounded-lg border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-gray-300"
                placeholder="Create a password"
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

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pl-12 glass-effect rounded-lg border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-gray-300"
                placeholder="Confirm your password"
              />
              <SafeIcon icon={FiLock} className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="loading-spinner w-5 h-5"></div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-200">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-300 hover:text-purple-200 font-medium">
              Sign in here
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-gray-300 hover:text-white text-sm">
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;