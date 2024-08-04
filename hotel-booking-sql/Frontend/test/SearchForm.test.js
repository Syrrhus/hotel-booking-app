import React from 'react'; // Add this import
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SearchForm from '../src/SearchForm'; // Adjust path if necessary
import destinationsData from '../src/destinations.json'; // Adjust path if necessary

describe('SearchForm Component', () => {
  test('should display no suggestions for empty input', () => {
    render(<SearchForm />);
    fireEvent.change(screen.getByLabelText(/Destination\/Hotel Name/i), { target: { value: '' } });
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  test('should display suggestions for valid input', () => {
    render(<SearchForm />);
    fireEvent.change(screen.getByLabelText(/Destination\/Hotel Name/i), { target: { value: 'New York' } });
    expect(screen.getAllByRole('option')).toHaveLength(3); // Check for multiple options
  });

  test('should handle user selecting a destination', () => {
    render(<SearchForm />);
    fireEvent.change(screen.getByLabelText(/Destination\/Hotel Name/i), { target: { value: 'New York' } });
    fireEvent.click(screen.getAllByRole('option', { name: /New York/i })[0]); // Click the first option
    expect(screen.getByDisplayValue(/New York/i)).toBeInTheDocument();
  });

  test('should display error for invalid destination', () => {
    render(<SearchForm />);
    fireEvent.change(screen.getByLabelText(/Destination\/Hotel Name/i), { target: { value: 'Invalid' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    expect(screen.getByText(/Please fill in all required fields/i)).toBeInTheDocument();
  });
});
