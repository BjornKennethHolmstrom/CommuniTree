import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '../contexts/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import Register from './Register';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Mock auth context
const mockApi = {
  post: jest.fn(),
};
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    api: mockApi,
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

const renderRegisterWithProviders = () => {
  return render(
    <BrowserRouter>
      <ChakraProvider>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <Register />
          </AuthProvider>
        </I18nextProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders registration form with all elements', () => {
    renderRegisterWithProviders();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByText(/have account/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderRegisterWithProviders();
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  test('validates password requirements', async () => {
    renderRegisterWithProviders();
    
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.blur(passwordInput);

    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { value: 'onlyletters' } });
    fireEvent.blur(passwordInput);

    expect(await screen.findByText(/password must contain at least one number/i)).toBeInTheDocument();
  });

  test('handles successful registration', async () => {
    renderRegisterWithProviders();
    
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const nameInput = screen.getByLabelText(/name/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });

    mockApi.post.mockResolvedValueOnce({
      data: {
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
        },
      },
    });
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/auth/register', {
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123',
      });
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('handles registration error', async () => {
    renderRegisterWithProviders();
    
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const nameInput = screen.getByLabelText(/name/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });

    const error = new Error('Username already taken');
    error.response = { data: { msg: 'Username already taken' } };
    mockApi.post.mockRejectedValueOnce(error);
    
    fireEvent.click(submitButton);

    expect(await screen.findByText(/username already taken/i)).toBeInTheDocument();
  });

  test('toggles password visibility', async () => {
    renderRegisterWithProviders();
    
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('handles language switching', async () => {
    renderRegisterWithProviders();
    
    // Change language to Swedish
    await i18n.changeLanguage('sv');
    
    expect(screen.getByRole('button', { name: /registrera/i })).toBeInTheDocument();
    
    // Change back to English
    await i18n.changeLanguage('en');
    
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});
