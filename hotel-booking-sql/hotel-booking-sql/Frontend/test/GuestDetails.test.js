import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // For matchers like .toBeInTheDocument()
import GuestDetails from '../src/pages/CombinedForm/GuestDetails';
import { validNoneEmpty, validatePhoneNumber } from '../src/pages/CombinedForm/validation';

// Mock the validation functions
jest.mock('../src/pages/CombinedForm/validation', () => ({
  validNoneEmpty: jest.fn(),
  validatePhoneNumber: jest.fn(),
}));

describe('GuestDetails Component', () => {
  const setup = (props = {}) => {
    const defaultProps = {
      guestInfo: {
        salutation: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
      },
      handleChange: jest.fn(),
      nextStep: jest.fn(),
      prevStep: jest.fn(),
      ...props,
    };

    render(<GuestDetails {...defaultProps} />);
    return defaultProps;
  };

  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render GuestDetails component', () => {
    setup();
    expect(screen.getByLabelText(/Salutation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  test('should validate form fields and show alerts', async () => {
    const { handleChange, nextStep } = setup();

    // Set up mocks for validation functions
    validNoneEmpty.mockImplementation((value) => !value);
    validatePhoneNumber.mockImplementation((value) => value.startsWith('+65'));

    // Test empty first name
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: '' } });
    fireEvent.click(screen.getByText(/Next/i));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please fill in your first name ');
    });
    expect(nextStep).not.toHaveBeenCalled();
    window.alert.mockClear(); // Clear the alert mock

    // Test empty last name
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } }); // Reset first name
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: '' } });
    fireEvent.click(screen.getByText(/Next/i));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please fill in your last name');
    });
    expect(nextStep).not.toHaveBeenCalled();
    window.alert.mockClear(); // Clear the alert mock

    // Test invalid email
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } }); 
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } }); 
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByText(/Next/i));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please fill in your first name');
    });
    expect(nextStep).not.toHaveBeenCalled();
    window.alert.mockClear(); // Clear the alert mock

    // Test invalid phone number
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } }); 
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } }); 
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '123' } });
    fireEvent.click(screen.getByText(/Next/i));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Invalid phone number keyed! 123');
    });
    expect(nextStep).not.toHaveBeenCalled();
    window.alert.mockClear(); // Clear the alert mock

    // Test successful validation
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } }); 
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } }); 
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '+6598765432' } }); // Reset phone number
    fireEvent.click(screen.getByText(/Next/i));

    await waitFor(() => {
      expect(window.alert).not.toHaveBeenCalled();
    });
    expect(nextStep).toHaveBeenCalled();
  });

  test('should call prevStep on Back button click', () => {
    const { prevStep } = setup();
    fireEvent.click(screen.getByText(/Back/i));
    expect(prevStep).toHaveBeenCalled();
  });
});
