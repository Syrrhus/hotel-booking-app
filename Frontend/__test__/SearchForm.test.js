import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../src/components/header/Header';

describe('Header Component', () => {
  test('should display no suggestions for empty input', () => {
    render(
      <Router>
        <Header />
      </Router>
    );
    fireEvent.change(screen.getByLabelText(/Destination\/Hotel Name/i), { target: { value: '' } });
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  test('should display suggestions for valid input', () => {
    render(
      <Router>
        <Header />
      </Router>
    );
    fireEvent.change(screen.getByLabelText(/Destination\/Hotel Name/i), { target: { value: 'New York' } });
    expect(screen.queryAllByRole('option').length).toBeGreaterThan(0);
  });

  test('should handle user selecting a destination', () => {
    render(
      <Router>
        <Header />
      </Router>
    );
    fireEvent.change(screen.getByLabelText(/Destination\/Hotel Name/i), { target: { value: 'New York' } });
    fireEvent.click(screen.getAllByRole('option', { name: /New York/i })[0]);
    expect(screen.getByDisplayValue(/New York/i)).toBeInTheDocument();
  });

  test('should display error for invalid destination', () => {
    render(
      <Router>
        <Header />
      </Router>
    );
    fireEvent.change(screen.getByLabelText(/Destination\/Hotel Name/i), { target: { value: 'Invalid' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    expect(screen.getByText(/Please fill in all required fields/i)).toBeInTheDocument();
  });
});

