import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  signup: (name: string, email: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('navgati_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = (email: string, password: string): boolean => {
    // Mock authentication - only allow specific email/password
    if (email === 'avneeshkumarjha1506@gmail.com' && password === 'Avneesh@*') {
      const savedUser = localStorage.getItem('navgati_user')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
        return true
      }
    }
    return false
  }

  const signup = (name: string, email: string, password: string): boolean => {
    // Mock signup - only allow specific email
    if (email === 'avneeshkumarjha1506@gmail.com' && password === 'Avneesh@*') {
      const userData = { email, name }
      localStorage.setItem('navgati_user', JSON.stringify(userData))
      setUser(userData)
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('navgati_user')
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
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