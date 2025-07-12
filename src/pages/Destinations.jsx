import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SafeIcon from '../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { destinationService } from '../services/destinationService'
import { getTravelRecommendations, parseDestinationResults, isApiConfigured, getApiStatus } from '../services/openaiService'

const { FiMapPin, FiStar, FiHeart, FiEye, FiFilter, FiX, FiInfo, FiRefreshCw } = FiIcons

const Destinations = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [apiStatus, setApiStatus] = useState(null)
  const [destinations, setDestinations] = useState([])

  useEffect(() => {
    // Check API status
    setApiStatus(getApiStatus())
    // Load destinations and favorites
    loadDestinations()
    if (user) {
      loadUserFavorites()
    }
  }, [user])

  const loadDestinations = async () => {
    setIsLoading(true)
    try {
      // First, get destinations from Supabase
      const result = await destinationService.getDestinations({
        category: activeFilter !== 'all' ? activeFilter : undefined
      })

      if (result.success) {
        setDestinations(result.destinations)
        toast.success('Destinations loaded from database!')
      } else {
        console.error('Failed to load destinations:', result.error)
        toast.error('Failed to load destinations')
      }
    } catch (error) {
      console.error('Error loading destinations:', error)
      toast.error('Failed to load destinations')
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserFavorites = async () => {
    if (!user) return

    try {
      const result = await destinationService.getUserFavorites(user.id)
      if (result.success) {
        const favoriteIds = result.favorites.map(fav => fav.destination_id)
        setFavorites(favoriteIds)
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }

  const refreshDestinations = async () => {
    setIsRefreshing(true)
    if (!isApiConfigured()) {
      toast.success('Refreshing destinations from database!')
      await loadDestinations()
    } else {
      toast.success('Finding new destinations for you!')
      // Get AI-enhanced destinations and potentially add them to database
      try {
        const response = await getTravelRecommendations('Philippines', 'top tourist destinations')
        if (response && response.recommendations && !response.fallback) {
          toast.success('Found new AI-powered recommendations!')
        }
      } catch (error) {
        console.error('AI refresh error:', error)
      }
      await loadDestinations()
    }
    setIsRefreshing(false)
  }

  const toggleFavorite = async (destinationId) => {
    if (!user) {
      toast.error('Please login to save favorites')
      return
    }

    try {
      const isFavorited = favorites.includes(destinationId)
      
      if (isFavorited) {
        const result = await destinationService.removeFromFavorites(user.id, destinationId)
        if (result.success) {
          setFavorites(prev => prev.filter(id => id !== destinationId))
          toast.success('Removed from favorites')
        }
      } else {
        const result = await destinationService.addToFavorites(user.id, destinationId)
        if (result.success) {
          setFavorites(prev => [...prev, destinationId])
          toast.success('Added to favorites')
        }
      }
    } catch (error) {
      console.error('Toggle favorite error:', error)
      toast.error('Failed to update favorites')
    }
  }

  const viewDestinationDetails = (destination) => {
    setSelectedDestination(destination)
  }

  const closeDestinationDetails = () => {
    setSelectedDestination(null)
  }

  const filterDestinations = async (category) => {
    setActiveFilter(category)
    toast.success(`Showing ${category === 'all' ? 'all destinations' : category + ' destinations'}`)
    
    // Reload destinations with filter
    try {
      const result = await destinationService.getDestinations({
        category: category !== 'all' ? category : undefined
      })
      
      if (result.success) {
        setDestinations(result.destinations)
      }
    } catch (error) {
      console.error('Filter error:', error)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <SafeIcon
        key={i}
        icon={FiStar}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Popular Destinations
          </h1>
          <p className="text-gray-600">
            Discover the most beautiful places in the Philippines
          </p>

          {/* API Status Indicator */}
          {!isApiConfigured() && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md mx-auto">
              <div className="flex items-center space-x-2 text-blue-700">
                <SafeIcon icon={FiInfo} className="w-4 h-4" />
                <span className="text-sm">
                  Database mode: Using Supabase backend. Configure OpenAI API for AI-powered suggestions.
                </span>
              </div>
            </div>
          )}

          <button
            onClick={refreshDestinations}
            disabled={isRefreshing}
            className="mt-4 flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors mx-auto"
          >
            <SafeIcon
              icon={FiRefreshCw}
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>
              {isRefreshing ? 'Refreshing destinations...' : 'Refresh destinations'}
            </span>
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            'all',
            'Beach',
            'Island', 
            'Mountain',
            'Cultural',
            'Historical',
            'Natural Wonder'
          ].map(category => (
            <button
              key={category}
              onClick={() => filterDestinations(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === category
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="loading-spinner w-12 h-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                className="glass-effect rounded-lg overflow-hidden card-hover"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative">
                  <img
                    src={destination.image_url}
                    alt={destination.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
                    }}
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(destination.id)
                      }}
                      className={`p-2 rounded-full glass-effect ${
                        favorites.includes(destination.id)
                          ? 'text-red-500'
                          : 'text-gray-400 hover:text-red-500'
                      } transition-colors`}
                    >
                      <SafeIcon icon={FiHeart} className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        viewDestinationDetails(destination)
                      }}
                      className="p-2 rounded-full glass-effect text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <SafeIcon icon={FiEye} className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                      {destination.category || 'Destination'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{destination.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">{renderStars(destination.rating)}</div>
                    <span className="text-sm text-gray-600">{destination.rating}</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{destination.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {destination.description?.substring(0, 80)}...
                  </p>
                  <button
                    onClick={() => viewDestinationDetails(destination)}
                    className="w-full btn-primary py-2 text-sm"
                  >
                    Explore Destination
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {destinations.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <SafeIcon icon={FiInfo} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No destinations found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              Show all destinations
            </button>
          </div>
        )}

        {/* Destination Detail Modal */}
        <AnimatePresence>
          {selectedDestination && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={closeDestinationDetails}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-lg overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <img
                    src={selectedDestination.image_url}
                    alt={selectedDestination.name}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
                    }}
                  />
                  <button
                    onClick={closeDestinationDetails}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h2 className="text-2xl font-bold text-white">{selectedDestination.name}</h2>
                    <div className="flex items-center space-x-2">
                      <div className="flex text-yellow-400">
                        {renderStars(selectedDestination.rating)}
                      </div>
                      <span className="text-white">{selectedDestination.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <SafeIcon icon={FiMapPin} className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-gray-700">{selectedDestination.location}</span>
                    </div>
                    <span className="text-purple-600 font-medium">
                      {selectedDestination.price_range || '₱₱'}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">About</h3>
                  <p className="text-gray-600 mb-4">{selectedDestination.description}</p>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Popular Activities</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(selectedDestination.activities || ['Sightseeing', 'Photography', 'Local Experience']).map(
                      (activity, index) => (
                        <span
                          key={index}
                          className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm"
                        >
                          {activity}
                        </span>
                      )
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        closeDestinationDetails()
                        if (user) {
                          navigate('/itinerary')
                          toast.success(`Added ${selectedDestination.name} to your itinerary planning!`)
                        } else {
                          toast.error('Please login to plan your itinerary')
                        }
                      }}
                      className="flex-1 btn-primary py-3"
                    >
                      Plan Your Visit
                    </button>
                    <button
                      onClick={() => toggleFavorite(selectedDestination.id)}
                      className={`p-3 rounded-lg border-2 ${
                        favorites.includes(selectedDestination.id)
                          ? 'border-red-500 text-red-500 bg-red-50'
                          : 'border-gray-300 text-gray-500 hover:border-red-500 hover:text-red-500'
                      }`}
                    >
                      <SafeIcon icon={FiHeart} className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default Destinations