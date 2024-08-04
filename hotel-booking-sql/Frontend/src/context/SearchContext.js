import React, { createContext, useState } from 'react';

// Create a context
export const SearchContext = createContext();

// Create a provider component
export const SearchProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useState({
    destination_id: '',
    checkin: '',
    checkout: '',
    guests: '',
  });

  return (
    <SearchContext.Provider value={{ searchParams, setSearchParams }}>
      {children}
    </SearchContext.Provider>
  );
};
