import React, { createContext, useState, useEffect } from 'react';

// Create a context
export const SearchContext = createContext();

// Create a provider component
export const SearchProvider = ({ children }) => {
  // Retrieve initial state from localStorage, if it exists
  const [searchParams, setSearchParams] = useState(() => {
    const savedParams = localStorage.getItem('searchParams');
    return savedParams ? JSON.parse(savedParams) : {
      destination_id: '',
      checkin: '',
      checkout: '',
      guests: '',
      roomDetails: {},
      hotelprices:[],
    };
  });

  // Use useEffect to save searchParams to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('searchParams', JSON.stringify(searchParams));
  }, [searchParams]);

  return (
    <SearchContext.Provider value={{ searchParams, setSearchParams }}>
      {children}
    </SearchContext.Provider>
  );
};