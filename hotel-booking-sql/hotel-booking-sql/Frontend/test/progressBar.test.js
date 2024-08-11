import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressBar from '../src/components/progressbar/ProgressBar';
import { faPaintBrush } from '@fortawesome/free-solid-svg-icons';

describe('ProgressBar Component is rendered', () => {
    test('renders booking step correctly', () => {
        render(<ProgressBar step={1} />);
    
        // Check if the initial step "1. Booking" is in the document
        const pBar = screen.getByText(/1. Booking/i);
        expect(pBar).toBeInTheDocument();
      });

    test('renders guest details correctly', () => {
        render(<ProgressBar step={2} />);
    
        // Check if the initial step "1. Booking" is in the document
        const pBar = screen.getByText(/2. Guest Details/i);
        expect(pBar).toBeInTheDocument();
      });

    test('renders confirmation correctly', () => {
        render(<ProgressBar step={3} />);
    
        // Check if the initial step "1. Booking" is in the document
        const pBar = screen.getByText(/3. Confirmation/i);
        expect(pBar).toBeInTheDocument();
      });

    test('renders payment correctly', () => {
        render(<ProgressBar step={4} />);
    
        // Check if the initial step "1. Booking" is in the document
        const pBar = screen.getByText(/4. Payment/i);
        expect(pBar).toBeInTheDocument();
      });
});
