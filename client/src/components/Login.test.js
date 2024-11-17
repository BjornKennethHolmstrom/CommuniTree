import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '../contexts/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import Login from './Login';

// Mock navigation
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Mock auth context
const mockLogin = jest.fn();
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

const renderLoginWithProviders = () => {
  return render(
    <BrowserRouter>
      <ChakraProvider>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </I18nextProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with all elements', () => {
    renderLoginWithProviders();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByText(/no account/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderLoginWithProviders();
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Wait for validation messages
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    renderLoginWithProviders();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    mockLogin.mockResolvedValueOnce();
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('handles login error', async () => {
    renderLoginWithProviders();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    const error = new Error('Invalid credentials');
    error.response = { data: { msg: 'Invalid credentials' } };
    mockLogin.mockRejectedValueOnce(error);
    
    fireEvent.click(submitButton);

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  test('shows loading state during login', async () => {
    renderLoginWithProviders();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute('aria-busy', 'true');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).not.toHaveAttribute('aria-busy', 'true');
    });
  });

  test('handles language switching', async () => {
    renderLoginWithProviders();
    
    // Change language to Swedish
    await i18n.changeLanguage('sv');
    
    expect(screen.getByRole('button', { name: /logga in/i })).toBeInTheDocument();
    
    // Change back to English
    await i18n.changeLanguage('en');
    
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});
