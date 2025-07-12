import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const { 
  FiMapPin, 
  FiCalendar, 
  FiClock, 
  FiStar, 
  FiHeart, 
  FiCamera, 
  FiCloudRain, 
  FiSun, 
  FiDollarSign, 
  FiCoffee, 
  FiHome, 
  FiArrowLeft, 
  FiShare2, 
  FiCheck 
} = FiIcons;

const ExploreLocation = () => {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock location data - in a real app, this would come from an API
  const mockLocations = {
    'lucban': {
      id: 'lucban',
      name: 'Lucban, Quezon',
      description: 'Famous for its colorful Pahiyas Festival and delicious local cuisine',
      image: 'https://images.pexels.com/photos/2675268/pexels-photo-2675268.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 4.6,
      category: 'Cultural',
      weather: {
        temperature: '24°C',
        condition: 'Partly Cloudy',
        icon: FiSun
      },
      bestTimeToVisit: 'May (Pahiyas Festival)',
      attractions: [
        {
          name: 'Pahiyas Festival',
          description: 'Colorful festival with kiping decorations',
          rating: 4.8,
          image: 'https://images.pexels.com/photos/2675268/pexels-photo-2675268.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
        },
        {
          name: 'Lucban Church',
          description: 'Historic Basilica of St. Louis of Toulouse',
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1507551116824-9b1f52b51ab1?w=400&h=300&fit=crop'
        }
      ],
      restaurants: [
        {
          name: "Buddy's Pancit Lucban",
          cuisine: 'Filipino',
          rating: 4.6,
          priceRange: '₱₱',
          specialty: 'Pancit Habhab & Longganisa'
        },
        {
          name: 'Dealo Koffee Lucban',
          cuisine: 'Café',
          rating: 4.5,
          priceRange: '₱',
          specialty: 'Local Coffee & Broas'
        }
      ],
      accommodations: [
        {
          name: 'Batis Aramin Resort',
          type: 'Resort',
          rating: 4.6,
          priceRange: '₱₱₱',
          amenities: ['Pool', 'Mountain View', 'Restaurant']
        }
      ]
    },
    'boracay': {
      id: 'boracay',
      name: 'Boracay, Aklan',
      description: 'World-famous white sand beach paradise',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      rating: 4.8,
      category: 'Beach',
      weather: {
        temperature: '28°C',
        condition: 'Sunny',
        icon: FiSun
      },
      bestTimeToVisit: 'November to April',
      attractions: [
        {
          name: 'White Beach',
          description: 'Pristine 4km stretch of white sand',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
        }
      ],
      restaurants: [],
      accommodations: []
    }
  };

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const locationData = mockLocations[locationId?.toLowerCase()] || mockLocations['lucban'];
      setLocation(locationData);
      
      // Check if location is in favorites
      const favorites = JSON.parse(localStorage.getItem('galagram_favorites') || '[]');
      setIsFavorite(favorites.includes(locationData.id));
      
      setIsLoading(false);
    }, 1000);
  }, [locationId]);

  const toggleFavorite = () => {
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('galagram_favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter(id => id !== location.id);
      toast.success('Removed from favorites');
    } else {
      newFavorites = [...favorites, location.id];
      toast.success('Added to favorites');
    }
    
    localStorage.setItem('galagram_favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const shareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: `${location.name} - GalaGram`,
        text: location.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center my-12">
          <div className="loading-spinner w-12 h-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Location Not Found</h2>
          <p className="text-gray-600 mb-6">The location you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/destinations')}
            className="btn-primary"
          >
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={shareLocation}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <SafeIcon icon={FiShare2} className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <SafeIcon icon={FiHeart} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="glass-effect rounded-lg overflow-hidden mb-8">
          <div className="relative">
            <img
              src={location.image}
              alt={location.name}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <h1 className="text-3xl font-bold text-white mb-2">{location.name}</h1>
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center space-x-1">
                  <div className="flex text-yellow-400">
                    {renderStars(location.rating)}
                  </div>
                  <span className="text-white ml-2">{location.rating}</span>
                </div>
                <span className="px-2 py-1 bg-white/20 text-white text-sm rounded-full">
                  {location.category}
                </span>
              </div>
              <p className="text-white text-opacity-90">{location.description}</p>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-effect p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={location.weather.icon} className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="font-medium text-gray-800">Weather</p>
                <p className="text-sm text-gray-600">{location.weather.temperature} - {location.weather.condition}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-effect p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiCalendar} className="w-8 h-8 text-purple-500" />
              <div>
                <p className="font-medium text-gray-800">Best Time</p>
                <p className="text-sm text-gray-600">{location.bestTimeToVisit}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-effect p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiMapPin} className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-medium text-gray-800">Location</p>
                <p className="text-sm text-gray-600">Philippines</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'attractions', label: 'Attractions' },
            { id: 'dining', label: 'Dining' },
            { id: 'stay', label: 'Where to Stay' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="glass-effect p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">About {location.name}</h3>
                <p className="text-gray-600 mb-6">{location.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Quick Facts</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Category: {location.category}</li>
                      <li>• Rating: {location.rating}/5.0</li>
                      <li>• Best time to visit: {location.bestTimeToVisit}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Planning Your Visit</h4>
                    <button
                      onClick={() => {
                        if (user) {
                          navigate('/itinerary');
                          toast.success(`Added ${location.name} to your itinerary!`);
                        } else {
                          toast.error('Please login to plan your itinerary');
                        }
                      }}
                      className="btn-primary w-full"
                    >
                      Add to Itinerary
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attractions' && (
              <div className="space-y-6">
                {location.attractions.map((attraction, index) => (
                  <div key={index} className="glass-effect p-6 rounded-lg">
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full md:w-48 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{attraction.name}</h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex text-yellow-400">
                            {renderStars(attraction.rating)}
                          </div>
                          <span className="text-sm text-gray-600">{attraction.rating}</span>
                        </div>
                        <p className="text-gray-600">{attraction.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'dining' && (
              <div className="space-y-6">
                {location.restaurants.length > 0 ? (
                  location.restaurants.map((restaurant, index) => (
                    <div key={index} className="glass-effect p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">{restaurant.name}</h4>
                        <span className="text-purple-600 font-medium">{restaurant.priceRange}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex text-yellow-400">
                          {renderStars(restaurant.rating)}
                        </div>
                        <span className="text-sm text-gray-600">{restaurant.rating}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{restaurant.cuisine}</span>
                      </div>
                      <p className="text-gray-600">Specialty: {restaurant.specialty}</p>
                    </div>
                  ))
                ) : (
                  <div className="glass-effect p-6 rounded-lg text-center">
                    <SafeIcon icon={FiCoffee} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Restaurant information coming soon!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'stay' && (
              <div className="space-y-6">
                {location.accommodations.length > 0 ? (
                  location.accommodations.map((hotel, index) => (
                    <div key={index} className="glass-effect p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">{hotel.name}</h4>
                        <span className="text-purple-600 font-medium">{hotel.priceRange}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex text-yellow-400">
                          {renderStars(hotel.rating)}
                        </div>
                        <span className="text-sm text-gray-600">{hotel.rating}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{hotel.type}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.map((amenity, amenityIndex) => (
                          <span
                            key={amenityIndex}
                            className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="glass-effect p-6 rounded-lg text-center">
                    <SafeIcon icon={FiHome} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Accommodation information coming soon!</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ExploreLocation;