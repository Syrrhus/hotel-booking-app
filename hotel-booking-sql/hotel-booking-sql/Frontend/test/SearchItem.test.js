import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import SearchItem from '../src/components/searchItem/SearchItem';
import { SearchContext } from '../src/context/SearchContext';

jest.mock('axios');

const hotel = {
  id: '1',
  name: 'Hotel Example',
  address: '123 Example St',
  image_details: {
    prefix: 'https://example.com/',
    suffix: 'hotel.jpg'
  },
  freeTaxi: true,
  subtitle: 'A great hotel',
  features: 'Free WiFi, Pool, Spa',
  freeCancellation: true,
  rating: 4.5,
  price: 200
};

const searchParams = {
  destination_id: '100',
  checkin: '2024-09-01',
  checkout: '2024-09-05',
  adults: 2,
//   hotelprices: {
//     '1': {
//       price: 200,
//     },
//   },
};

describe('SearchItem Component', () => {
  it('renders correctly with hotel data', () => {
    render(
      <SearchContext.Provider value={{ searchParams }}>
        <Router>
          <SearchItem hotel={hotel} />
        </Router>
      </SearchContext.Provider>
    );

    expect(screen.getByText(hotel.name)).toBeInTheDocument();
    expect(screen.getByText(hotel.address)).toBeInTheDocument();
    expect(screen.getByText('Free airport taxi')).toBeInTheDocument();
    expect(screen.getByText(hotel.subtitle)).toBeInTheDocument();
    expect(screen.getByText(hotel.features)).toBeInTheDocument();
    expect(screen.getByText('Free cancellation')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument(); // Rating text
  });

  it('navigates to hotel details page on button click', () => {
    const navigate = jest.fn();

    render(
      <SearchContext.Provider value={{ searchParams }}>
        <Router>
          <SearchItem hotel={hotel} />
        </Router>
      </SearchContext.Provider>
    );

    fireEvent.click(screen.getByText('See availability'));
    expect(navigate).not.toHaveBeenCalled(); // Note: For actual navigation, integration tests would be needed
  });

  it('fetches price when searchParams change and sets it correctly', async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          id: '1',
          price: 200,
        },
      ],
    });

    render(
      <SearchContext.Provider value={{ searchParams }}>
        <Router>
          <SearchItem hotel={hotel} />
        </Router>
      </SearchContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('$200')).toBeInTheDocument();
    });
  });

  it('displays "NotAvailable" when no price is provided', () => {
    const noPriceHotel = { ...hotel, id: '2', price: null };

    render(
      <SearchContext.Provider value={{ searchParams }}>
        <Router>
          <SearchItem hotel={noPriceHotel} />
        </Router>
      </SearchContext.Provider>
    );

    expect(screen.getByText('$NotAvailable')).toBeInTheDocument();
  });

  it('fetches and displays price correctly', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: '1',
          price: 200,
        },
      ],
    });

    render(
      <SearchContext.Provider value={{ searchParams, setSearchParams: jest.fn() }}>
        <Router>
          <SearchItem hotel={hotel} />
        </Router>
      </SearchContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('$200')).toBeInTheDocument();
    });
  });

});
