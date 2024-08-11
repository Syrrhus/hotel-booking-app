// test/HotelRendering.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Hotel from '../src/pages/hotel/Hotel'; // Adjust the path based on your folder structure
import { SearchContext } from '../src/context/SearchContext'; // Ensure this path is correct

// Mock the useLocation hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: {
      hotel: {
        id: 'hotel-1',
        name: 'Test Hotel',
        address: '123 Test Street',
        rating: 4.5,
        distance: 1000,
        price: 200,
        image_details: {
          prefix: 'https://example.com/',
          suffix: '.jpg',
        },
        imageCount: 3,
        original_metadata: {
          city: 'Test City',
        },
        trustyou: {
          score: {
            overall: 8,
            kaligo_overall: 8,
            solo: 8,
            couple: 8,
            family: 8,
            business: 8,
          },
        },
        categories: {
          family_hotel: { name: 'Family Hotel', score: 9, popularity: 8 },
        },
        amenities_ratings: [
          { name: 'Pool', score: 9 },
          { name: 'WiFi', score: 8 },
        ],
        amenities: {
          FreeWiFi: true,
          Parking: true,
        },
        latitude: 51.5074,
        longitude: -0.1278,
      },
    },
  }),
}));

describe('Hotel Component Rendering', () => {
  // Mock Search Context
  const mockContextValue = {
    searchParams: {
      destination_id: '123',
      checkin: '2024-08-01',
      checkout: '2024-08-10',
      adults: 2,
      roomDetails: {
        'hotel-1': [
          {
            price: 200,
            description: 'Room 1',
            images: [{ url: 'image1.jpg' }],
            amenities: ['Free WiFi', 'Parking', 'Pool'], // Add amenities array
          },
        ],
      },
    },
    setSearchParams: jest.fn(),
  };

  test('renders Hotel component without crashing', () => {
    render(
      <MemoryRouter>
        <SearchContext.Provider value={mockContextValue}>
          <Hotel />
        </SearchContext.Provider>
      </MemoryRouter>
    );

    // Check that the hotel name is rendered
    expect(screen.getByText(/Test Hotel/i)).toBeInTheDocument();
    expect(screen.getByText(/Book a stay over \$200 only!/i)).toBeInTheDocument();
  });

  test('displays hotel details correctly', () => {
    render(
      <MemoryRouter>
        <SearchContext.Provider value={mockContextValue}>
          <Hotel />
        </SearchContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Stay in the heart of Test City/i)).toBeInTheDocument();
    expect(screen.getByText(/Book a stay over \$200 only!/i)).toBeInTheDocument();
    expect(screen.getByText(/Available Rooms/i)).toBeInTheDocument();
    expect(screen.getByText(/Room 1/i)).toBeInTheDocument();

    // Use specific selectors to avoid conflicts
    expect(screen.getByText(/\$200/i, { selector: '.hotelPriceHighlight' })).toBeInTheDocument();
    expect(screen.getByText(/\$200/i, { selector: '.roomDetailsContent b' })).toBeInTheDocument();

    expect(screen.getByText(/Free WiFi/i)).toBeInTheDocument();

    // Use getAllByText if there are multiple "Parking" texts
    expect(screen.getAllByText(/Parking/i)).toHaveLength(2); // Assuming there are 2 "Parking" items

    expect(screen.getByText(/Pool/i)).toBeInTheDocument();
  });
});
