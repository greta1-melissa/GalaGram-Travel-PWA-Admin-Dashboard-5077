import { supabase } from '../lib/supabase'

export const reviewService = {
  // Get all reviews with optional filtering
  async getReviews(filters = {}) {
    try {
      let query = supabase
        .from('reviews_galagram_2024')
        .select(`
          *,
          users_galagram_2024 (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })

      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category)
      }

      // Apply search filter
      if (filters.search) {
        query = query.or(`destination_name.ilike.%${filters.search}%,location.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error

      // Transform data to match expected format
      const reviews = data?.map(review => ({
        id: review.id,
        user: `${review.users_galagram_2024?.first_name} ${review.users_galagram_2024?.last_name}`,
        rating: review.rating,
        date: review.created_at,
        category: review.category,
        place: review.destination_name,
        location: review.location,
        review: review.review_text,
        likes: review.likes_count,
        comments: review.comments_count,
        images: review.images || []
      })) || []

      return { success: true, reviews }
    } catch (error) {
      console.error('Get reviews error:', error)
      return { success: false, error: error.message }
    }
  },

  // Create new review
  async createReview(userId, reviewData) {
    try {
      const { data, error } = await supabase
        .from('reviews_galagram_2024')
        .insert({
          user_id: userId,
          destination_name: reviewData.place,
          location: reviewData.location,
          category: reviewData.category,
          rating: reviewData.rating,
          review_text: reviewData.review,
          images: reviewData.images || []
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, review: data }
    } catch (error) {
      console.error('Create review error:', error)
      return { success: false, error: error.message }
    }
  },

  // Update review
  async updateReview(reviewId, updates) {
    try {
      const { data, error } = await supabase
        .from('reviews_galagram_2024')
        .update(updates)
        .eq('id', reviewId)
        .select()
        .single()

      if (error) throw error

      return { success: true, review: data }
    } catch (error) {
      console.error('Update review error:', error)
      return { success: false, error: error.message }
    }
  },

  // Delete review
  async deleteReview(reviewId) {
    try {
      const { error } = await supabase
        .from('reviews_galagram_2024')
        .delete()
        .eq('id', reviewId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Delete review error:', error)
      return { success: false, error: error.message }
    }
  }
}