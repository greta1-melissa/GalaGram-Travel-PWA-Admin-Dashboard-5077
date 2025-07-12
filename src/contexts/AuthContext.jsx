import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          setLoading(false)
          return
        }

        if (session) {
          setSession(session)
          setUser(session.user)
          
          // Fetch user profile
          const profileResult = await authService.getUserProfile(session.user.id)
          if (profileResult.success) {
            setProfile(profileResult.profile)
          }
        }
      } catch (error) {
        console.error('Get session error:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session)
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Fetch user profile
          const profileResult = await authService.getUserProfile(session.user.id)
          if (profileResult.success) {
            setProfile(profileResult.profile)
          }
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const register = async (userData) => {
    try {
      setLoading(true)
      const result = await authService.signUp(
        userData.email, 
        userData.password, 
        {
          firstName: userData.firstName,
          lastName: userData.lastName
        }
      )
      
      return result
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      return await authService.signIn(email, password)
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      const result = await authService.signOut()
      
      if (result.success) {
        setUser(null)
        setProfile(null)
        setSession(null)
      }
      
      return result
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) return { success: false, error: 'No user logged in' }
      
      const result = await authService.updateUserProfile(user.id, {
        first_name: updates.firstName,
        last_name: updates.lastName,
        bio: updates.bio,
        location: updates.location,
        profile_picture_url: updates.profilePicture
      })
      
      if (result.success) {
        setProfile(result.profile)
      }
      
      return result
    } catch (error) {
      console.error('Update profile error:', error)
      return { success: false, error: error.message }
    }
  }

  // Transform profile data to match expected format
  const transformedUser = profile ? {
    id: user?.id,
    email: user?.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    bio: profile.bio,
    location: profile.location,
    profilePicture: profile.profile_picture_url,
    createdAt: profile.created_at
  } : null

  const value = {
    user: transformedUser,
    session,
    loading,
    login,
    register,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}