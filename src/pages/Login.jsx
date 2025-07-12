import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiLock, FiEye, FiEyeOff, FiAlertTriangle } = FiIcons;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved email
    const savedEmail = localStorage.getItem('galagram_saved_email');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For demo - prefill with test account
      if (formData.email === '' && formData.password === '') {
        setFormData({
          email: 'demo@example.com',
          password: 'password123'
        });
        toast.success('Using demo account');
        return;
      }

      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Save email if remember me is checked
        if (rememberMe) {
          localStorage.setItem('galagram_saved_email', formData.email);
        } else {
          localStorage.removeItem('galagram_saved_email');
        }
        
        toast.success('Welcome back to GalaGram!');
        navigate('/');
      } else {
        setError(result.error);
        toast.error(result.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo login with animation
  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@example.com',
      password: 'password123'
    });
    
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 500);
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
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-200">Sign in to your GalaGram account</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-white p-3 rounded-lg mb-6 flex items-start">
            <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full px-4 py-3 pl-12 pr-12 glass-effect rounded-lg border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-gray-300"
                placeholder="Enter your password"
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-200">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="text-purple-300 hover:text-purple-200">
                Forgot password?
              </a>
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
              'Sign In'
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-gray-600 flex-grow"></div>
          <span className="mx-4 text-sm text-gray-300">or</span>
          <div className="border-t border-gray-600 flex-grow"></div>
        </div>

        <button
          onClick={handleDemoLogin}
          className="w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center"
        >
          Try Demo Account
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-200">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-300 hover:text-purple-200 font-medium">
              Sign up here
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

export default Login;