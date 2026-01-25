import React, { createContext, useContext, useState } from 'react';
const CityContext = createContext(undefined);
export function CityProvider({ children }) {
    const [selectedCity, setSelectedCity] = useState('Bangalore');
    const cities = ['Bangalore', 'Punjab', 'Raipur', 'Mumbai', 'Delhi'];
    return (<CityContext.Provider value={{ selectedCity, setSelectedCity, cities }}>
      {children}
    </CityContext.Provider>);
}
export function useCity() {
    const context = useContext(CityContext);
    if (context === undefined) {
        throw new Error('useCity must be used within a CityProvider');
    }
    return context;
}
