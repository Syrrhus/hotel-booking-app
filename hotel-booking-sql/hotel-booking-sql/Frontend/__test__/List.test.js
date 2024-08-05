import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import List from '../src/pages/list/List';
import { SearchContext } from '../src/context/SearchContext';

jest.mock('axios');

const mockSearchContextValue = {
  searchParams: {
    destination_id: 'some-destination-id',
    checkIn: new Date('2024-08-10'),
    checkOut: new Date('2024-08-15'),
    adults: 2,
    children: 0,
    rooms: 1
  },
  setSearchParams: jest.fn()
};

describe('List Component', () => {
  test('fetches and displays hotels on search', async () => {
    const mockResponse = { data: [{ id: 1, name: 'Hotel A', rating: 4.5 }, { id: 2, name: 'Hotel B', rating: 4.0 }] };
    axios.get.mockResolvedValueOnce(mockResponse);

    render(
      <SearchContext.Provider value={mockSearchContextValue}>
        <MemoryRouter>
          <List />
        </MemoryRouter>
      </SearchContext.Provider>
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Hotel A')).toBeInTheDocument();
      expect(screen.getByText('Hotel B')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    render(
      <SearchContext.Provider value={mockSearchContextValue}>
        <MemoryRouter>
          <List />
        </MemoryRouter>
      </SearchContext.Provider>
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Error fetching hotels:')).toBeInTheDocument();
    });
  });
});
