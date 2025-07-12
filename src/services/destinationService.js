import { supabase } from '../lib/supabase'

export const destinationService = {
  // Get all destinations with optional filtering
  async getDestinations(filters = {}) {
    try {
      let query = supabase
        .from('destinations_galagram_2024')
        .select('*')
        .order('rating', { ascending: false })

      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category)
      }

      // Apply rating filter
      if (filters.minRating) {
        query = query.gte('rating', filters.minRating)
      }

      // Apply search filter
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,location.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error

      return { success: true, destinations: data || [] }
    } catch (error) {
      console.error('Get destinations error:', error)
      return { success: false, error: error.message }
    }
  },

  // Get user's favorite destinations
  async getUserFavorites(userId) {
    try {
      const { data, error } = await supabase
        .from('user_favorites_galagram_2024')
        .select(`
          id,
          destination_id,
          destinations_galagram_2024 (*)
        `)
        .eq('user_id', userId)

      if (error) throw error

      return { success: true, favorites: data || [] }
    } catch (error) {
      console.error('Get favorites error:', error)
      return { success: false, error: error.message }
    }
  },

  // Add destination to favorites
  async addToFavorites(userId, destinationId) {
    try {
      const { data, error } = await supabase
        .from('user_favorites_galagram_2024')
        .insert({
          user_id: userId,
          destination_id: destinationId
        })
        .select()

      if (error) throw error

      return { success: true, favorite: data[0] }
    } catch (error) {
      console.error('Add to favorites error:', error)
      return { success: false, error: error.message }
    }
  },

  // Remove destination from favorites
  async removeFromFavorites(userId, destinationId) {
    try {
      const { error } = await supabase
        .from('user_favorites_galagram_2024')
        .delete()
        .eq('user_id', userId)
        .eq('destination_id', destinationId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Remove from favorites error:', error)
      return { success: false, error: error.message }
    }
  },

  // Check if destination is favorited by user
  async isFavorited(userId, destinationId) {
    try {
      const { data, error } = await supabase
        .from('user_favorites_galagram_2024')
        .select('id')
        .eq('user_id', userId)
        .eq('destination_id', destinationId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return { success: true, isFavorited: !!data }
    } catch (error) {
      console.error('Check favorite error:', error)
      return { success: false, error: error.message }
    }
  }
}