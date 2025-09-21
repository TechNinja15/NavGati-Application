import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  email: string
  name: string
  role: 'passenger' | 'driver' | 'student'
  studentData?: {
    state: string
    city: string
    institution: string
    studentBusId: string
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  signup: (name: string, email: string, password: string, role?: 'passenger' | 'driver' | 'student') => boolean
  logout: () => void
  isAuthenticated: boolean
  showRoleSelection: boolean
  showStudentOnboarding: boolean
  setUserRole: (role: 'passenger' | 'driver' | 'student') => void
  completeStudentOnboarding: (studentData: {
    state: string
    city: string
    institution: string
    studentBusId: string
  }) => void
  goBackToRoleSelection: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [showStudentOnboarding, setShowStudentOnboarding] = useState(false)

  // Removed auto-login to always start with login/signup flow

  const login = (email: string, password: string): boolean => {
    // Mock authentication - accept any credentials for testing
    if (email && password) {
      // For mock purposes, create a default user profile
      const userData = { email, name: email.split('@')[0], role: 'passenger' as 'passenger' | 'driver' | 'student' }
      localStorage.setItem('navgati_user', JSON.stringify(userData))
      setUser(userData)
      setIsAuthenticated(true)
      setShowRoleSelection(true) // Always show role selection after login
      return true
    }
    return false
  }

  const signup = (name: string, email: string, password: string, role?: 'passenger' | 'driver' | 'student'): boolean => {
    // Mock signup - accept any credentials
    if (email && password && name) {
      if (role) {
        const userData = { email, name, role }
        localStorage.setItem('navgati_user', JSON.stringify(userData))
        setUser(userData)
        setIsAuthenticated(true)
        setShowRoleSelection(false)
        return true
      } else {
        // First signup without role - show role selection
        const tempUserData = { email, name, password }
        localStorage.setItem('navgati_temp_user', JSON.stringify(tempUserData))
        setShowRoleSelection(true)
        return true
      }
    }
    return false
  }

  const setUserRole = (role: 'passenger' | 'driver' | 'student') => {
    // Handle role selection from both signup and login flows
    if (role === 'student') {
      setShowRoleSelection(false)
      setShowStudentOnboarding(true)
      return
    }

    const tempUserData = localStorage.getItem('navgati_temp_user')
    if (tempUserData) {
      // From signup flow
      const userData = JSON.parse(tempUserData)
      const finalUserData = { 
        email: userData.email, 
        name: userData.name, 
        role 
      }
      localStorage.setItem('navgati_user', JSON.stringify(finalUserData))
      localStorage.removeItem('navgati_temp_user')
      setUser(finalUserData)
      setIsAuthenticated(true)
      setShowRoleSelection(false)
    } else if (user) {
      // From login flow - update existing user with selected role
      const updatedUser = { ...user, role }
      localStorage.setItem('navgati_user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setShowRoleSelection(false)
    }
  }

  const completeStudentOnboarding = (studentData: {
    state: string
    city: string
    institution: string
    studentBusId: string
  }) => {
    const tempUserData = localStorage.getItem('navgati_temp_user')
    let finalUserData
    
    if (tempUserData) {
      // From signup flow
      const userData = JSON.parse(tempUserData)
      finalUserData = { 
        email: userData.email, 
        name: userData.name, 
        role: 'student' as const,
        studentData
      }
      localStorage.removeItem('navgati_temp_user')
    } else if (user) {
      // From login flow
      finalUserData = { 
        ...user, 
        role: 'student' as const,
        studentData
      }
    }
    
    if (finalUserData) {
      localStorage.setItem('navgati_user', JSON.stringify(finalUserData))
      setUser(finalUserData as User)
      setIsAuthenticated(true)
      setShowStudentOnboarding(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('navgati_user')
    localStorage.removeItem('navgati_temp_user')
    setUser(null)
    setIsAuthenticated(false)
    setShowRoleSelection(false)
    setShowStudentOnboarding(false)
  }

  const goBackToRoleSelection = () => {
    setShowRoleSelection(true)
    setShowStudentOnboarding(false)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      isAuthenticated, 
      showRoleSelection, 
      showStudentOnboarding,
      setUserRole,
      completeStudentOnboarding,
      goBackToRoleSelection
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}