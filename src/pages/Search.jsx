import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  getTravelRecommendations,
  getFoodRecommendations,
  getAccommodationRecommendations,
  parseDestinationResults,
  isApiConfigured,
  getApiStatus
} from '../services/openaiService';

const { FiSearch, FiMapPin, FiStar, FiClock, FiDollarSign, FiFilter, FiChevronDown, FiCheckCircle, FiInfo } = FiIcons;

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const [filters, setFilters] = useState({
    budget: 'all',
    rating: 'all',
    interests: []
  });

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'destinations', name: 'Places to Visit' },
    { id: 'restaurants', name: 'Food & Dining' },
    { id: 'accommodations', name: 'Places to Stay' }
  ];

  const interests = [
    'Beach',
    'Mountains',
    'Cultural',
    'Adventure',
    'Family-friendly',
    'Luxury',
    'Budget-friendly',
    'Historical',
    'Nature',
    'Nightlife'
  ];

  useEffect(() => {
    // Check API status on component mount
    setApiStatus(getApiStatus());
    console.log('API Status:', getApiStatus());
  }, []);

  const handleSearch = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!searchQuery.trim()) return;
    setLoading(true);

    // Show appropriate message based on API configuration
    if (!isApiConfigured()) {
      toast.loading('Searching with demo data...', {id: 'search'});
    } else {
      toast.loading('Finding the best recommendations for you...', {id: 'search'});
    }

    try {
      // Get recommendations based on category
      const destination = searchQuery.trim();
      console.log('Searching for:', destination);

      const [placesRes, foodRes, accommodationsRes] = await Promise.all([
        getTravelRecommendations(destination, 'tourist attractions and places to visit'),
        getFoodRecommendations(destination),
        getAccommodationRecommendations(
          destination,
          filters.budget !== 'all' ? filters.budget : null
        )
      ]);

      console.log('Search results received:', {placesRes, foodRes, accommodationsRes});

      // Parse the AI responses into structured data
      const results = {
        destinations: parseDestinationResults(placesRes.recommendations, placesRes.fallback),
        restaurants: parseDestinationResults(foodRes.recommendations, foodRes.fallback),
        accommodations: parseDestinationResults(accommodationsRes.recommendations, accommodationsRes.fallback)
      };

      console.log('Parsed results:', results);
      setSearchResults(results);

      if (placesRes.fallback) {
        toast.success('Showing demo recommendations! Configure OpenAI API for personalized results.', {id: 'search'});
      } else {
        toast.success('Found some great recommendations!', {id: 'search'});
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Sorry, we encountered an issue. Using demo data instead.', {id: 'search'});

      // Use fallback data if an error occurs
      const fallbackResults = await Promise.all([
        getTravelRecommendations(searchQuery.trim(), 'tourist attractions', {fallback: true}),
        getFoodRecommendations(searchQuery.trim(), {fallback: true}),
        getAccommodationRecommendations(searchQuery.trim(), {fallback: true})
      ]);

      const results = {
        destinations: parseDestinationResults(fallbackResults[0].recommendations, true),
        restaurants: parseDestinationResults(fallbackResults[1].recommendations, true),
        accommodations: parseDestinationResults(fallbackResults[2].recommendations, true)
      };

      setSearchResults(results);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type, value) => {
    if (type === 'interests') {
      // Toggle interest selection
      const newInterests = filters.interests.includes(value)
        ? filters.interests.filter(i => i !== value)
        : [...filters.interests, value];
      setFilters({...filters, interests: newInterests});
    } else {
      setFilters({...filters, [type]: value});
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <SafeIcon
        key={i}
        icon={FiStar}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getFilteredResults = () => {
    if (!searchResults) return null;

    let results = [];

    // Filter by category
    if (activeCategory === 'all') {
      results = [
        ...searchResults.destinations,
        ...searchResults.restaurants,
        ...searchResults.accommodations
      ];
    } else {
      results = searchResults[activeCategory] || [];
    }

    // Apply filters
    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      results = results.filter(item => parseFloat(item.rating) >= minRating);
    }

    // Filter by interests if any are selected
    if (filters.interests.length > 0) {
      // This is a simplistic approach - in a real app, you'd have tags for each item
      results = results.filter(item => {
        const description = item.description?.toLowerCase() || '';
        return filters.interests.some(interest => 
          description.includes(interest.toLowerCase())
        );
      });
    }

    return results;
  };

  const filteredResults = searchResults ? getFilteredResults() : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Discover Your Next Adventure
          </h1>
          <p className="text-gray-600">
            Search for restaurants, attractions, and accommodations across the Philippines
          </p>

          {/* API Status Indicator */}
          {!isApiConfigured() && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md mx-auto">
              <div className="flex items-center space-x-2 text-blue-700">
                <SafeIcon icon={FiInfo} className="w-4 h-4" />
                <span className="text-sm">Demo mode: Using curated recommendations. Configure OpenAI API for personalized results.</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter destination (e.g., Manila, Boracay, Palawan, Lucban)"
              className="w-full px-4 py-3 pl-12 glass-effect rounded-lg border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <SafeIcon icon={FiSearch} className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 btn-primary px-6 py-2 disabled:opacity-50"
            >
              {loading ? <div className="loading-spinner w-4 h-4"></div> : 'Search'}
            </button>
          </div>
        </form>

        {searchResults && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Category Tabs */}
            <div className="flex overflow-x-auto pb-2 mb-6 no-scrollbar">
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                        : 'bg-white/50 text-gray-700 hover:bg-white/70'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <SafeIcon icon={FiFilter} className="w-4 h-4" />
                <span>Filters</span>
                <SafeIcon
                  icon={FiChevronDown}
                  className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                />
              </button>

              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass-effect p-4 rounded-lg mt-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Budget Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget
                      </label>
                      <select
                        value={filters.budget}
                        onChange={(e) => handleFilterChange('budget', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      >
                        <option value="all">All Budgets</option>
                        <option value="budget">Budget-Friendly</option>
                        <option value="moderate">Moderate</option>
                        <option value="luxury">Luxury</option>
                      </select>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Rating
                      </label>
                      <select
                        value={filters.rating}
                        onChange={(e) => handleFilterChange('rating', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      >
                        <option value="all">Any Rating</option>
                        <option value="3">3+ Stars</option>
                        <option value="4">4+ Stars</option>
                        <option value="4.5">4.5+ Stars</option>
                      </select>
                    </div>
                  </div>

                  {/* Interests Filter */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interests
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <button
                          key={interest}
                          onClick={() => handleFilterChange('interests', interest)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            filters.interests.includes(interest)
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults && filteredResults.length > 0 ? (
                filteredResults.map((item, index) => (
                  <motion.div
                    key={item.id || index}
                    className="glass-effect rounded-lg overflow-hidden card-hover"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop';
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">{renderStars(item.rating)}</div>
                        <span className="text-sm text-gray-600">{item.rating}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{item.location || searchQuery}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-3">{item.description}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">No results match your filters. Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Demo Search Suggestions */}
        {!searchResults && (
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Try searching for these popular destinations:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Manila', 'Boracay', 'Palawan', 'Cebu', 'Bohol', 'Siargao', 'Lucban'].map((destination) => (
                <button
                  key={destination}
                  onClick={() => {
                    setSearchQuery(destination);
                    handleSearch();
                  }}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                >
                  {destination}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Search;