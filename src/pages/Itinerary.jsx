import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SafeIcon from '../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { itineraryService } from '../services/itineraryService'
import { generateItinerarySuggestion } from '../services/openaiService'

const { FiPlus, FiCalendar, FiMapPin, FiClock, FiEdit, FiTrash2, FiX, FiCheck, FiArrowRight, FiArrowLeft, FiShare2, FiDownload, FiRefreshCw } = FiIcons

const Itinerary = () => {
  const { user } = useAuth()
  const [itineraries, setItineraries] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [currentItinerary, setCurrentItinerary] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [newItinerary, setNewItinerary] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: ''
  })
  const [newActivity, setNewActivity] = useState({
    name: '',
    time: '',
    day: 1,
    notes: ''
  })
  const [aiSuggestion, setAiSuggestion] = useState({
    destination: '',
    days: 3
  })

  useEffect(() => {
    if (user) {
      loadUserItineraries()
    }
  }, [user])

  const loadUserItineraries = async () => {
    setIsLoading(true)
    try {
      const result = await itineraryService.getUserItineraries(user.id)
      if (result.success) {
        setItineraries(result.itineraries)
      } else {
        toast.error('Failed to load itineraries')
      }
    } catch (error) {
      console.error('Error loading itineraries:', error)
      toast.error('Failed to load itineraries')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateItinerary = async (e) => {
    e.preventDefault()
    
    // Validate dates
    if (new Date(newItinerary.startDate) > new Date(newItinerary.endDate)) {
      toast.error('End date must be after start date')
      return
    }

    try {
      const result = await itineraryService.createItinerary(user.id, newItinerary)
      
      if (result.success) {
        setItineraries(prev => [result.itinerary, ...prev])
        setNewItinerary({ title: '', destination: '', startDate: '', endDate: '' })
        setShowModal(false)
        setCurrentItinerary(null)
        toast.success('Itinerary created successfully!')
      } else {
        toast.error(result.error || 'Failed to create itinerary')
      }
    } catch (error) {
      console.error('Create itinerary error:', error)
      toast.error('Failed to create itinerary')
    }
  }

  const deleteItinerary = async (id) => {
    try {
      const result = await itineraryService.deleteItinerary(id)
      
      if (result.success) {
        setItineraries(prev => prev.filter(item => item.id !== id))
        toast.success('Itinerary deleted')
      } else {
        toast.error(result.error || 'Failed to delete itinerary')
      }
    } catch (error) {
      console.error('Delete itinerary error:', error)
      toast.error('Failed to delete itinerary')
    }
  }

  const handleAddActivity = async () => {
    if (!currentItinerary) return

    try {
      const result = await itineraryService.addActivity(currentItinerary.id, newActivity)
      
      if (result.success) {
        // Update local state
        setItineraries(prev => prev.map(itinerary => {
          if (itinerary.id === currentItinerary.id) {
            return {
              ...itinerary,
              activities: [...itinerary.activities, result.activity]
            }
          }
          return itinerary
        }))
        
        setNewActivity({ name: '', time: '', day: 1, notes: '' })
        setShowActivityModal(false)
        toast.success('Activity added successfully!')
      } else {
        toast.error(result.error || 'Failed to add activity')
      }
    } catch (error) {
      console.error('Add activity error:', error)
      toast.error('Failed to add activity')
    }
  }

  const deleteActivity = async (itineraryId, activityId) => {
    try {
      const result = await itineraryService.deleteActivity(activityId)
      
      if (result.success) {
        setItineraries(prev => prev.map(itinerary => {
          if (itinerary.id === itineraryId) {
            return {
              ...itinerary,
              activities: itinerary.activities.filter(activity => activity.id !== activityId)
            }
          }
          return itinerary
        }))
        toast.success('Activity removed')
      } else {
        toast.error(result.error || 'Failed to remove activity')
      }
    } catch (error) {
      console.error('Delete activity error:', error)
      toast.error('Failed to remove activity')
    }
  }

  const generateAIItinerary = async () => {
    if (!aiSuggestion.destination) {
      toast.error('Please enter a destination')
      return
    }

    setIsGenerating(true)
    toast.loading('Generating your personalized itinerary...', { id: 'ai-itinerary' })

    try {
      const response = await generateItinerarySuggestion(
        aiSuggestion.destination,
        aiSuggestion.days
      )

      if (response && response.itinerary) {
        // Create a new itinerary in Supabase
        const title = `${aiSuggestion.destination} ${aiSuggestion.days}-Day Trip`
        const today = new Date()
        const startDate = new Date(today)
        startDate.setDate(today.getDate() + 30) // Start in 1 month
        const endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + aiSuggestion.days - 1)

        const newAIItinerary = {
          title: title,
          destination: aiSuggestion.destination,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        }

        const result = await itineraryService.createItinerary(user.id, newAIItinerary)
        
        if (result.success) {
          setItineraries(prev => [result.itinerary, ...prev])
          toast.success('AI itinerary created successfully!', { id: 'ai-itinerary' })
          setShowAIModal(false)
          setAiSuggestion({ destination: '', days: 3 })
        } else {
          toast.error('Failed to save AI itinerary', { id: 'ai-itinerary' })
        }
      } else {
        toast.error('Failed to generate itinerary. Please try again.', { id: 'ai-itinerary' })
      }
    } catch (error) {
      console.error('Error generating itinerary:', error)
      toast.error('Failed to generate itinerary. Please try again.', { id: 'ai-itinerary' })
    } finally {
      setIsGenerating(false)
    }
  }

  const exportItinerary = (itinerary) => {
    // Create a formatted text of the itinerary
    let text = `${itinerary.title}\n`
    text += `Destination: ${itinerary.destination}\n`
    text += `Dates: ${new Date(itinerary.start_date).toLocaleDateString()} - ${new Date(
      itinerary.end_date
    ).toLocaleDateString()}\n\n`

    // Group activities by day
    const activitiesByDay = {}
    itinerary.activities.forEach(activity => {
      if (!activitiesByDay[activity.day]) {
        activitiesByDay[activity.day] = []
      }
      activitiesByDay[activity.day].push(activity)
    })

    // Add activities to text
    Object.keys(activitiesByDay)
      .sort()
      .forEach(day => {
        text += `Day ${day}:\n`
        activitiesByDay[day]
          .sort((a, b) => a.time.localeCompare(b.time))
          .forEach(activity => {
            text += `  ${activity.time} - ${activity.name}\n`
            if (activity.notes) {
              text += `    Note: ${activity.notes}\n`
            }
          })
        text += '\n'
      })

    // Create a download link
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${itinerary.title.replace(/\s+/g, '_')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('Itinerary exported successfully!')
  }

  const shareItinerary = (itinerary) => {
    navigator.clipboard.writeText(`Check out my trip to ${itinerary.destination} on GalaGram!`)
    toast.success('Sharing link copied to clipboard!')
  }

  // Calculate days between start and end date
  const getDaysBetween = (start, end) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate - startDate)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Itineraries</h1>
            <p className="text-gray-600">Plan and organize your travel adventures</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAIModal(true)}
              className="btn-primary flex items-center space-x-2 bg-gradient-to-r from-green-500 to-teal-600"
            >
              <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
              <span>AI Planner</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <SafeIcon icon={FiPlus} className="w-5 h-5" />
              <span>New Itinerary</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="loading-spinner w-12 h-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {itineraries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itineraries.map((itinerary, index) => {
                  const dayCount = getDaysBetween(itinerary.start_date, itinerary.end_date)
                  return (
                    <motion.div
                      key={itinerary.id}
                      className="glass-effect rounded-lg p-6 card-hover"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{itinerary.title}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => shareItinerary(itinerary)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <SafeIcon icon={FiShare2} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteItinerary(itinerary.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-gray-600">
                          <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2" />
                          <span className="text-sm">{itinerary.destination}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {new Date(itinerary.start_date).toLocaleDateString()} -{' '}
                            {new Date(itinerary.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <span className="text-sm font-medium bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                            {dayCount} {dayCount === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-700">Activities</h4>
                          <span className="text-xs text-gray-500">
                            {itinerary.activities.length} total
                          </span>
                        </div>
                        {itinerary.activities.length > 0 ? (
                          <div className="max-h-36 overflow-y-auto pr-2 space-y-2">
                            {itinerary.activities
                              .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
                              .slice(0, 3)
                              .map((activity) => (
                                <div
                                  key={activity.id}
                                  className="flex items-center justify-between py-2 px-3 bg-white/50 rounded-lg"
                                >
                                  <div>
                                    <span className="text-sm text-gray-700">{activity.name}</span>
                                    <div className="flex items-center text-xs text-gray-500">
                                      <span className="bg-purple-100 text-purple-800 px-1.5 rounded text-xs mr-2">
                                        Day {activity.day}
                                      </span>
                                      <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                                      {activity.time}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => deleteActivity(itinerary.id, activity.id)}
                                    className="p-1 text-gray-400 hover:text-red-500"
                                  >
                                    <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            {itinerary.activities.length > 3 && (
                              <div className="text-center text-sm text-purple-600">
                                +{itinerary.activities.length - 3} more activities
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No activities added yet</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setCurrentItinerary(itinerary)
                            setShowActivityModal(true)
                          }}
                          className="flex-1 btn-primary py-2 text-sm"
                        >
                          Add Activity
                        </button>
                        <button
                          onClick={() => exportItinerary(itinerary)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <SafeIcon icon={FiDownload} className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="glass-effect rounded-lg p-8 text-center">
                <SafeIcon icon={FiCalendar} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Itineraries Yet</h3>
                <p className="text-gray-500 mb-6">
                  Create your first travel itinerary to get started
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setShowAIModal(true)}
                    className="btn-primary inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-teal-600"
                  >
                    <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
                    <span>Generate with AI</span>
                  </button>
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiPlus} className="w-5 h-5" />
                    <span>Create Manually</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Create/Edit Itinerary Modal */}
        <AnimatePresence>
          {showModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-effect rounded-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {currentItinerary ? 'Edit Itinerary' : 'Create New Itinerary'}
                </h2>
                <form onSubmit={handleCreateItinerary} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={newItinerary.title}
                      onChange={(e) => setNewItinerary({ ...newItinerary, title: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="Enter itinerary title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination
                    </label>
                    <input
                      type="text"
                      value={newItinerary.destination}
                      onChange={(e) => setNewItinerary({ ...newItinerary, destination: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="Enter destination"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={newItinerary.startDate}
                        onChange={(e) => setNewItinerary({ ...newItinerary, startDate: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={newItinerary.endDate}
                        onChange={(e) => setNewItinerary({ ...newItinerary, endDate: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button type="submit" className="flex-1 btn-primary py-2">
                      {currentItinerary ? 'Update Itinerary' : 'Create Itinerary'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false)
                        setCurrentItinerary(null)
                        setNewItinerary({ title: '', destination: '', startDate: '', endDate: '' })
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Add Activity Modal */}
        <AnimatePresence>
          {showActivityModal && currentItinerary && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowActivityModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-effect rounded-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-1">Add Activity</h2>
                <p className="text-gray-600 text-sm mb-4">to {currentItinerary.title}</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Name
                    </label>
                    <input
                      type="text"
                      value={newActivity.name}
                      onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="e.g., Beach Hopping, City Tour"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                      <select
                        value={newActivity.day}
                        onChange={(e) => setNewActivity({ ...newActivity, day: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      >
                        {Array.from(
                          {
                            length: getDaysBetween(
                              currentItinerary.start_date,
                              currentItinerary.end_date
                            )
                          },
                          (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              Day {i + 1}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input
                        type="time"
                        value={newActivity.time}
                        onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={newActivity.notes}
                      onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="Any additional details or reminders"
                      rows="3"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleAddActivity}
                      className="flex-1 btn-primary py-2 flex items-center justify-center space-x-2"
                    >
                      <SafeIcon icon={FiPlus} className="w-4 h-4" />
                      <span>Add Activity</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowActivityModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* AI Itinerary Generator Modal */}
        <AnimatePresence>
          {showAIModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAIModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-effect rounded-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiRefreshCw} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">AI Itinerary Generator</h2>
                    <p className="text-gray-600 text-sm">
                      Create a personalized travel plan with AI
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination
                    </label>
                    <input
                      type="text"
                      value={aiSuggestion.destination}
                      onChange={(e) => setAiSuggestion({ ...aiSuggestion, destination: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="e.g., Palawan, Bohol, Manila"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Days
                    </label>
                    <select
                      value={aiSuggestion.days}
                      onChange={(e) => setAiSuggestion({ ...aiSuggestion, days: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 7, 10, 14].map((day) => (
                        <option key={day} value={day}>
                          {day} {day === 1 ? 'day' : 'days'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={generateAIItinerary}
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <div className="loading-spinner w-5 h-5 border-2 border-white/30 border-t-white"></div>
                      ) : (
                        <>
                          <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
                          <span>Generate Itinerary</span>
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Our AI will plan your perfect trip based on local insights
                    </p>
                  </div>
                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAIModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default Itinerary