// Hotel.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { SearchContext } from '../src/context/SearchContext';
import Hotel from '../src/pages/hotel/Hotel';

// Mocking the axios instance
const mock = new MockAdapter(axios);

describe('Hotel Component', () => {
  const hotel = {
    id: 1,
    name: 'Sample Hotel',
    address: '123 Main St',
    image_details: {
      prefix: 'https://example.com/image',
      suffix: '.jpg',
    },
    imageCount: 5,
    rating: 4.5,
    distance: 200,
    price: 100,
    latitude: 51.505,
    longitude: -0.09,
    original_metadata: {
      city: 'Sample City',
    },
    description: 'A lovely place to stay!',
    trustyou: {
      score: {
        overall: 8.5,
        kaligo_overall: 8.0,
        solo: 8.3,
        couple: 8.7,
        family: 8.9,
        business: 8.1,
      },
    },
    categories: {
      family_hotel: true,
    },
    amenities_ratings: [
      { name: 'WiFi', score: 8.5 },
      { name: 'Pool', score: 7.8 },
    ],
    amenities: {
      freeWifi: true,
      pool: true,
      parking: true,
    },
  };

  const searchParams = {
    destination_id: 1,
    checkin: new Date(),
    checkout: new Date(new Date().setDate(new Date().getDate() + 2)),
    adults: 2,
    roomDetails: {
      1: [
        {
          description: 'Deluxe Room',
          price: 200,
          images: [{ url: 'https://example.com/room1.jpg' }, { url: 'https://example.com/room2.jpg' }],
          amenities: ['Free WiFi', 'Air Conditioning', 'TV'],
        },
      ],
    },
  };

  const renderComponent = () =>
    render(
      <SearchContext.Provider value={{ searchParams, setSearchParams: jest.fn() }}>
        <MemoryRouter initialEntries={[{ state: { hotel } }]}>
          <Hotel />
        </MemoryRouter>
      </SearchContext.Provider>
    );

  beforeEach(() => {
    mock.reset();
  });

  it('renders hotel details correctly', async () => {
    renderComponent();

    // Check hotel details
    expect(screen.getByText('Sample Hotel')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('Rating: 4.5')).toBeInTheDocument();
    expect(screen.getByText('Excellent location: 200.00m')).toBeInTheDocument();
    expect(screen.getByText('Stay in the heart of Sample City')).toBeInTheDocument();
    expect(screen.getByText('A lovely place to stay!')).toBeInTheDocument();

    // Check TrustYou scores
    expect(screen.getByText('Overall: 8.5')).toBeInTheDocument();
    expect(screen.getByText('Kaligo Overall: 8.0')).toBeInTheDocument();
    expect(screen.getByText('Solo: 8.3')).toBeInTheDocument();
    expect(screen.getByText('Couple: 8.7')).toBeInTheDocument();
    expect(screen.getByText('Family: 8.9')).toBeInTheDocument();
    expect(screen.getByText('Business: 8.1')).toBeInTheDocument();

    // Check amenities ratings
    expect(screen.getByText('WiFi: 8.5')).toBeInTheDocument();
    expect(screen.getByText('Pool: 7.8')).toBeInTheDocument();

    // Check amenities
    expect(screen.getByText('Free Wifi')).toBeInTheDocument();
    expect(screen.getByText('Pool')).toBeInTheDocument();
    expect(screen.getByText('Parking')).toBeInTheDocument();

    // Check room details are loading
    expect(await screen.findByText('Loading room details...')).toBeInTheDocument();
  });

  it('displays room details once loaded', async () => {
    mock.onGet('http://localhost:5000/hotels/1/prices').reply(200, {
      completed: true,
      rooms: [
        {
          description: 'Deluxe Room',
          price: 200,
          images: [{ url: 'https://example.com/room1.jpg' }, { url: 'https://example.com/room2.jpg' }],
          amenities: ['Free WiFi', 'Air Conditioning', 'TV'],
        },
      ],
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Available Rooms')).toBeInTheDocument();
      expect(screen.getByText('Deluxe Room')).toBeInTheDocument();
      expect(screen.getByText('Price: $200')).toBeInTheDocument();
      expect(screen.getByText('Free WiFi')).toBeInTheDocument();
      expect(screen.getByText('Air Conditioning')).toBeInTheDocument();
      expect(screen.getByText('TV')).toBeInTheDocument();
    });
  });

  it('navigates to booking page when booking button is clicked', async () => {
    const { container } = renderComponent();

    await waitFor(() => {
      const button = screen.getByText('Reserve or Book Now!');
      fireEvent.click(button);
    });

    // Check navigation (this might require integration with actual routing tests)
    // Example: expect(navigate).toHaveBeenCalledWith('/hotels/1/book', expect.anything());
  });

  it('cycles through photos on carousel', async () => {
    const { container } = renderComponent();

    const nextButton = container.querySelector('.carouselArrow.right');
    fireEvent.click(nextButton);

    // Check that the second image is displayed
    expect(container.querySelector('.carouselImg').src).toBe('https://example.com/image1.jpg');

    const prevButton = container.querySelector('.carouselArrow.left');
    fireEvent.click(prevButton);

    // Check that the first image is displayed again
    expect(container.querySelector('.carouselImg').src).toBe('https://example.com/image0.jpg');
  });
});
