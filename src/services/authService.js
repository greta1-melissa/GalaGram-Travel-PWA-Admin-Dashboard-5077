import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export const authService = {
  // Sign up with email and password
  async signUp(email, password, userData) {
    try {
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      })

      if (authError) throw authError

      // Then create the user profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users_galagram_2024')
          .insert({
            id: authData.user.id,
            email,
            first_name: userData.firstName,
            last_name: userData.lastName
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Continue anyway, profile can be created later
        }
      }

      return { 
        success: true, 
        user: authData.user,
        session: authData.session
      }
    } catch (error) {
      console.error('Sign up error:', error)
      return { 
        success: false, 
        error: error.message || 'Failed to create account'
      }
    }
  },

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Fetch user profile
      const { data: profile } = await supabase
        .from('users_galagram_2024')
        .select('*')
        .eq('id', data.user.id)
        .single()

      return { 
        success: true, 
        user: data.user,
        profile,
        session: data.session
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return { 
        success: false, 
        error: error.message || 'Failed to sign in'
      }
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { 
        success: false, 
        error: error.message || 'Failed to sign out'
      }
    }
  },

  // Get current session
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      
      return { success: true, session }
    } catch (error) {
      console.error('Get session error:', error)
      return { success: false, error: error.message }
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users_galagram_2024')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      return { success: true, profile: data }
    } catch (error) {
      console.error('Get profile error:', error)
      return { success: false, error: error.message }
    }
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users_galagram_2024')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      return { success: true, profile: data }
    } catch (error) {
      console.error('Update profile error:', error)
      return { success: false, error: error.message }
    }
  }
}