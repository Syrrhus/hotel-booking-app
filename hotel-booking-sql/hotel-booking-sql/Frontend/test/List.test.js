import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import List from '../src/pages/list/List';
import { SearchContext } from '../src/context/SearchContext';
import { MemoryRouter, useLocation } from 'react-router-dom';
import axios from 'axios';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

jest.mock('axios');

// Mock data for testing
const mockHotels = [
  { id: 1, name: 'Hotel A', price: 100, rating: 4 },
  { id: 2, name: 'Hotel B', price: 200, rating: 3 },
  { id: 3, name: 'Hotel C', price: 300, rating: 5 },
];

const mockSearchParams = {
  PriceDetails: {},
  destination_id: '1',
  checkin: '2024-08-01',
  checkout: '2024-08-05',
  adults: 2,
};

const mockSetSearchParams = jest.fn();

// 1. Unit Test: Filtering Logic
const filterHotels = (hotels, priceRange, rating) => {
  return hotels.filter(hotel => 
    (hotel.price !== null && hotel.price >= priceRange[0] && hotel.price <= priceRange[1]) &&
    (hotel.rating !== null && hotel.rating >= rating[0] && hotel.rating <= rating[1])
  );
};

describe('filterHotels function', () => {
  test('filters hotels by price and rating', () => {
    const filtered = filterHotels(mockHotels, [150, 350], [4, 5]);
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Hotel C');
  });

  test('returns empty array if no hotels match criteria', () => {
    const filtered = filterHotels(mockHotels, [400, 500], [4, 5]);
    expect(filtered.length).toBe(0);
  });

  test('returns all hotels if all match criteria', () => {
    const filtered = filterHotels(mockHotels, [50, 350], [3, 5]);
    expect(filtered.length).toBe(3);
  });
});

// 2. Integration Test: List Component
describe('List Component Integration', () => {
    beforeEach(() => {
      axios.get = jest.fn().mockResolvedValue({
        data: [
          { id: 1, price: 150 },
          { id: 2, price: 250 },
          { id: 3, price: 350 },
        ],
      });
  
      const mockUseLocation = {
        state: {
          data: [
            { id: 1, name: 'Hotel A', price: 100, rating: 4 },
            { id: 2, name: 'Hotel B', price: 200, rating: 3 },
            { id: 3, name: 'Hotel C', price: 300, rating: 5 },
          ],
          searchParams: mockSearchParams,
        },
      };
  
      useLocation.mockReturnValue(mockUseLocation);
    });
  
    const setup = () => {
      return render(
        <MemoryRouter>
          <SearchContext.Provider value={{ searchParams: mockSearchParams, setSearchParams: mockSetSearchParams }}>
            <List />
          </SearchContext.Provider>
        </MemoryRouter>
      );
    };

  test('renders the list of hotels', () => {
    setup();
    const hotelElements = screen.getAllByText(/Hotel/);
    expect(hotelElements.length).toBe(3);
  });

  test('fetches and displays hotel prices', async () => {
    setup();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/hotels/prices', expect.any(Object));
    });

    // After fetching, check that the hotel prices have been merged into the list
    const hotelElements = screen.getAllByText(/Hotel/);
    expect(hotelElements.length).toBe(3);

    // Check that the prices are correctly displayed
    expect(screen.getByText('$150')).toBeInTheDocument();
    expect(screen.getByText('$250')).toBeInTheDocument();
    expect(screen.getByText('$350')).toBeInTheDocument();
  });

 



  test('shows loading indicator while fetching data', () => {
    setup();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
