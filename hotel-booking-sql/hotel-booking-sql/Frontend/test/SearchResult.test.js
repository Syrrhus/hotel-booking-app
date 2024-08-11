// system.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { createMemoryHistory } from 'history';
import Home from '../src/pages/home/Home';
import Header from '../src/components/header/Header';
import List from '../src/pages/list/List';
import { SearchContext } from '../src/context/SearchContext';

jest.mock('axios');

// Mocking the DatePicker components from MUI
jest.mock('@mui/x-date-pickers', () => ({
  ...jest.requireActual('@mui/x-date-pickers'),
  DatePicker: ({ label, value, onChange }) => (
    <input
      aria-label={label}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <SearchContext.Provider {...providerProps}>
      {ui}
    </SearchContext.Provider>,
    renderOptions
  );
};

describe('System Test', () => {
  const providerProps = {
    value: {
      searchParams: {
        destination_id: '1',
        checkin: '2023-01-01',
        checkout: '2023-01-10',
        adults: 2,
        PriceDetails: {},
      },
      setSearchParams: jest.fn(),
    },
  };

  const setup = () => {
    const history = createMemoryHistory();
    return {
      ...renderWithContext(
        <BrowserRouter history={history}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<List />} />
          </Routes>
        </BrowserRouter>,
        { providerProps }
      ),
      history,
    };
  };

  test('renders Home and navigates to List on search', async () => {
    console.log("Mocking axios.get for hotel search");
    axios.get.mockResolvedValue({
      data: Array(40).fill({
        id: 1,
        name: 'Test Hotel',
        price: 100,
        rating: 4.5,
      }),
    });

    const { history } = setup();

    console.log("Filling in form fields");
    fireEvent.change(screen.getByLabelText(/Destination\/Hotel Name/i), {
      target: { value: 'Test Destination' },
    });

    fireEvent.change(screen.getByLabelText(/Check-in/i), {
      target: { value: '2023-01-01' },
    });

    fireEvent.change(screen.getByLabelText(/Check-out/i), {
      target: { value: '2023-01-10' },
    });

    console.log("Clicking search button");
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    console.log("Waiting for axios.get to be called");
    await waitFor(() => {
      console.log("Checking if setSearchParams was called");
      expect(providerProps.value.setSearchParams).toHaveBeenCalled();

      console.log("Checking if axios.get was called with expected URL");
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/hotels', expect.anything());
    });

    console.log("Checking if navigation to /hotels occurred");
    expect(history.location.pathname).toBe('/hotels');
    await waitFor(() => {
      expect(screen.getByText('Test Hotel')).toBeInTheDocument();
    });
  });

  test('renders List and fetches hotel prices', async () => {
    console.log("Mocking axios.get for hotel prices");
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: 'Hotel 1',
          price: 200,
          rating: 4.5,
        },
      ],
    });

    providerProps.value.searchParams.PriceDetails = {};
    setup();

    console.log("Waiting for axios.get to be called for hotel prices");
    await waitFor(() => {
      console.log("Checking if axios.get was called with expected URL for prices");
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/hotels/prices', expect.anything());

      console.log("Checking if Hotel 1 is rendered");
      expect(screen.getByText('Hotel 1')).toBeInTheDocument();
    });
  });
});
