import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  email: string
  name: string
  role: 'passenger' | 'driver'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  signup: (name: string, email: string, password: string, role?: 'passenger' | 'driver') => boolean
  logout: () => void
  isAuthenticated: boolean
  showRoleSelection: boolean
  setUserRole: (role: 'passenger' | 'driver') => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showRoleSelection, setShowRoleSelection] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('navgati_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = (email: string, password: string): boolean => {
    // Mock authentication - accept any credentials
    if (email && password) {
      const savedUser = localStorage.getItem('navgati_user')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        if (userData.email === email) {
          setUser(userData)
          setIsAuthenticated(true)
          return true
        }
      }
    }
    return false
  }

  const signup = (name: string, email: string, password: string, role?: 'passenger' | 'driver'): boolean => {
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

  const setUserRole = (role: 'passenger' | 'driver') => {
    const tempUserData = localStorage.getItem('navgati_temp_user')
    if (tempUserData) {
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
    }
  }

  const logout = () => {
    localStorage.removeItem('navgati_user')
    localStorage.removeItem('navgati_temp_user')
    setUser(null)
    setIsAuthenticated(false)
    setShowRoleSelection(false)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated, showRoleSelection, setUserRole }}>
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