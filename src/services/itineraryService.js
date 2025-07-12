import { supabase } from '../lib/supabase'

export const itineraryService = {
  // Get user's itineraries
  async getUserItineraries(userId) {
    try {
      const { data, error } = await supabase
        .from('itineraries_galagram_2024')
        .select(`
          *,
          itinerary_activities_galagram_2024 (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform the data to match the expected format
      const itineraries = data?.map(itinerary => ({
        ...itinerary,
        activities: itinerary.itinerary_activities_galagram_2024?.map(activity => ({
          id: activity.id,
          name: activity.name,
          day: activity.day_number,
          time: activity.time,
          notes: activity.notes
        })) || []
      })) || []

      return { success: true, itineraries }
    } catch (error) {
      console.error('Get itineraries error:', error)
      return { success: false, error: error.message }
    }
  },

  // Create new itinerary
  async createItinerary(userId, itineraryData) {
    try {
      const { data, error } = await supabase
        .from('itineraries_galagram_2024')
        .insert({
          user_id: userId,
          title: itineraryData.title,
          destination: itineraryData.destination,
          start_date: itineraryData.startDate,
          end_date: itineraryData.endDate
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, itinerary: { ...data, activities: [] } }
    } catch (error) {
      console.error('Create itinerary error:', error)
      return { success: false, error: error.message }
    }
  },

  // Update itinerary
  async updateItinerary(itineraryId, updates) {
    try {
      const { data, error } = await supabase
        .from('itineraries_galagram_2024')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', itineraryId)
        .select()
        .single()

      if (error) throw error

      return { success: true, itinerary: data }
    } catch (error) {
      console.error('Update itinerary error:', error)
      return { success: false, error: error.message }
    }
  },

  // Delete itinerary
  async deleteItinerary(itineraryId) {
    try {
      const { error } = await supabase
        .from('itineraries_galagram_2024')
        .delete()
        .eq('id', itineraryId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Delete itinerary error:', error)
      return { success: false, error: error.message }
    }
  },

  // Add activity to itinerary
  async addActivity(itineraryId, activityData) {
    try {
      const { data, error } = await supabase
        .from('itinerary_activities_galagram_2024')
        .insert({
          itinerary_id: itineraryId,
          name: activityData.name,
          day_number: activityData.day,
          time: activityData.time,
          notes: activityData.notes || ''
        })
        .select()
        .single()

      if (error) throw error

      return { 
        success: true, 
        activity: {
          id: data.id,
          name: data.name,
          day: data.day_number,
          time: data.time,
          notes: data.notes
        }
      }
    } catch (error) {
      console.error('Add activity error:', error)
      return { success: false, error: error.message }
    }
  },

  // Delete activity
  async deleteActivity(activityId) {
    try {
      const { error } = await supabase
        .from('itinerary_activities_galagram_2024')
        .delete()
        .eq('id', activityId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Delete activity error:', error)
      return { success: false, error: error.message }
    }
  }
}