import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiThumbsUp, FiMessageCircle, FiFilter, FiSearch } = FiIcons;

const Reviews = () => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const reviews = [
    {
      id: 1,
      user: 'Maria Santos',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face',
      rating: 5,
      date: '2024-01-15',
      category: 'restaurant',
      place: 'Manam Comfort Filipino',
      location: 'Makati City',
      review: 'Amazing Filipino comfort food! The sisig and crispy pata were outstanding. Great ambiance and friendly staff.',
      likes: 24,
      comments: 8,
      images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop']
    },
    {
      id: 2,
      user: 'John Dela Cruz',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      rating: 4,
      date: '2024-01-10',
      category: 'attraction',
      place: 'Rizal Park',
      location: 'Manila',
      review: 'A peaceful escape in the heart of Manila. Rich in history and perfect for morning walks. The monuments are well-maintained.',
      likes: 18,
      comments: 5,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop']
    },
    {
      id: 3,
      user: 'Ana Reyes',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      rating: 5,
      date: '2024-01-08',
      category: 'hotel',
      place: 'The Peninsula Manila',
      location: 'Makati City',
      review: 'Luxury at its finest! Exceptional service, beautiful rooms, and the afternoon tea is a must-try. Worth every peso.',
      likes: 31,
      comments: 12,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop']
    }
  ];

  const categories = [
    { value: 'all', label: 'All Reviews' },
    { value: 'restaurant', label: 'Restaurants' },
    { value: 'attraction', label: 'Attractions' },
    { value: 'hotel', label: 'Hotels' }
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesCategory = filterCategory === 'all' || review.category === filterCategory;
    const matchesSearch = review.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <SafeIcon
        key={i}
        icon={FiStar}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Travel Reviews</h1>
          <p className="text-gray-600">Discover what fellow travelers are saying about their experiences</p>
        </div>

        {/* Filters */}
        <div className="glass-effect rounded-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setFilterCategory(category.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterCategory === category.value
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                      : 'bg-white/50 text-gray-700 hover:bg-white/70'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reviews..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <SafeIcon icon={FiSearch} className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="glass-effect rounded-lg p-6 card-hover"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-4">
                <img
                  src={review.avatar}
                  alt={review.user}
                  className="w-12 h-12 rounded-full object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{review.user}</h3>
                      <p className="text-sm text-gray-600">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-800">{review.place}</h4>
                    <p className="text-sm text-gray-600">{review.location}</p>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{review.review}</p>
                  
                  {review.images && review.images.length > 0 && (
                    <div className="flex space-x-2 mb-4">
                      {review.images.map((image, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={image}
                          alt={`Review image ${imgIndex + 1}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <button className="flex items-center space-x-1 hover:text-purple-600 transition-colors">
                      <SafeIcon icon={FiThumbsUp} className="w-4 h-4" />
                      <span>{review.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-purple-600 transition-colors">
                      <SafeIcon icon={FiMessageCircle} className="w-4 h-4" />
                      <span>{review.comments}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews found matching your criteria.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Reviews;