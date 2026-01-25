import React, { createContext, useContext, useState } from 'react'

interface CityContextType {
  selectedCity: string
  setSelectedCity: (city: string) => void
  cities: string[]
}

const CityContext = createContext<CityContextType | undefined>(undefined)

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCity] = useState('Bangalore')
  const cities = ['Bangalore', 'Punjab', 'Raipur', 'Mumbai', 'Delhi']

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity, cities }}>
      {children}
    </CityContext.Provider>
  )
}

export function useCity() {
  const context = useContext(CityContext)
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider')
  }
  return context
}