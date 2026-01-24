import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface User {
  email: string
  name: string
  role: 'passenger' | 'driver' | 'student'
  driverDetails?: {
    startStop: string
    endStop: string
    middleStops: string[]
    busRouteData: any
  }
  studentData?: {
    state: string
    city: string
    institution: string
    studentBusId: string
  }
}

interface AuthContextType {
  user: User | null
  login: (driverId: string, password: string) => Promise<boolean>
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

  // Restore session from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('navgati_user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Failed to parse user session:', error)
        localStorage.removeItem('navgati_user')
      }
    }
  }, [])

  const login = async (driverId: string, password: string): Promise<boolean> => {
    try {
      // Query the registered_buses table (which acts as the drivers table)
      const { data, error } = await supabase
        .from('registered_buses')
        .select('*')
        .eq('user_id', driverId)
        .eq('password', password)
        .single()

      if (error || !data) {
        console.error('Login failed:', error)
        return false
      }

      // Login successful
      const userData: User = {
        email: data.user_id, // Using user_id (e.g. DRV-...) as email/identifier
        name: `Driver ${data.user_id}`,
        role: 'driver',
        driverDetails: {
          startStop: data.start_stop,
          endStop: data.end_stop,
          middleStops: data.middle_stops || [],
          busRouteData: data.bus_route_data
        }
      }

      localStorage.setItem('navgati_user', JSON.stringify(userData))
      setUser(userData)
      setIsAuthenticated(true)
      setShowRoleSelection(false)
      return true
    } catch (err) {
      console.error('Unexpected login error:', err)
      return false
    }
  }

  const signup = (name: string, email: string, password: string, role?: 'passenger' | 'driver' | 'student'): boolean => {
    // Signup remains a mock/local function for Passengers/Students for now
    // logic as requested: "driver enter that id and pass... enter the app"

    // For Passengers/Students or Guest access
    if (email && name) {
      const resolvedRole = role || 'passenger'
      const userData = { email, name, role: resolvedRole }
      localStorage.setItem('navgati_user', JSON.stringify(userData))
      setUser(userData)
      setIsAuthenticated(true)
      setShowRoleSelection(false)
      return true
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
      // From login flow or already partially authenticated
      finalUserData = {
        ...user,
        role: 'student' as const,
        studentData
      }
    } else {
      // Direct access Student Portal (e.g. from Login screen button)
      // We create a generic student user
      finalUserData = {
        email: `student_${Date.now()}@university.edu`,
        name: 'Student User',
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