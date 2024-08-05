import { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchParams, setSearchParams] = useState({
        destination_id: '',
        checkIn: null,
        checkOut: null,
        adults: 2,
        children: 0,
        rooms: 1,
    });

    return (
        <SearchContext.Provider value={{ searchParams, setSearchParams }}>
            {children}
        </SearchContext.Provider>
    );
};
