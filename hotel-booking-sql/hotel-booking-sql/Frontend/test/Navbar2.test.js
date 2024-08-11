import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../src/components/navbar2/Navbar2'; // Adjust the path as necessary

// Mocking the useNavigate hook
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/' }), // Assume starting on the homepage
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    mockNavigate.mockClear();
    // Mock window.location.reload
    delete window.location;
    window.location = { reload: jest.fn() }; // Add this line
  });

  test('renders Navbar component', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logo = screen.getByAltText('Ascenda Logo');
    const backButton = screen.getByRole('button', { name: /</i });

    expect(logo).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
  });


  // Integration Testing 1  

  test('back button navigates to previous page', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const backButton = screen.getByRole('button', { name: /</i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });


  // Integration Testing 2 
  test('logo click navigates to home page or reloads', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logo = screen.getByAltText('Ascenda Logo');
    fireEvent.click(logo);

    // Check for home page navigation or reload
    if (mockNavigate.mock.calls.length) {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    } else {
      expect(window.location.reload).toHaveBeenCalled();
    }
  });
});
