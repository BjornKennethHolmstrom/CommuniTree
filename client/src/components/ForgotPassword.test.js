import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import ForgotPassword from './ForgotPassword';

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

const renderForgotPasswordWithProviders = () => {
  return render(
    <BrowserRouter>
      <ChakraProvider>
        <I18nextProvider i18n={i18n}>
          <ForgotPassword />
        </I18nextProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
};

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders forgot password form', () => {
    renderForgotPasswordWithProviders();

    expect(screen.getByRole('heading', { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByText(/back to login/i)).toBeInTheDocument();
  });

  test('validates email input', async () => {
    renderForgotPasswordWithProviders();
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    // Test empty email
    fireEvent.click(submitButton);
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();

    // Test invalid email format
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
  });

  test('handles successful password reset request', async () => {
    renderForgotPasswordWithProviders();
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ msg: 'Password reset link sent' }),
      })
    );

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/auth/forgot-password',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com' }),
        })
      );
    });

    expect(await screen.findByText(/check your email/i)).toBeInTheDocument();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });

  test('handles server error', async () => {
    renderForgotPasswordWithProviders();
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ msg: 'Server error' }),
      })
    );

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/server error/i)).toBeInTheDocument();
  });

  test('handles network error', async () => {
    renderForgotPasswordWithProviders();
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    mockFetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/error requesting password reset/i)).toBeInTheDocument();
  });

  test('shows loading state during submission', async () => {
    renderForgotPasswordWithProviders();
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    mockFetch.mockImplementationOnce(() =>
      new Promise(resolve =>
        setTimeout(
          () =>
            resolve({
              ok: true,
              json: () => Promise.resolve({ msg: 'Password reset link sent' }),
            }),
          100
        )
      )
    );

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute('aria-busy', 'true');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).not.toHaveAttribute('aria-busy', 'true');
    });
  });

  test('handles language switching', async () => {
    renderForgotPasswordWithProviders();
    
    // Change language to Swedish
    await i18n.changeLanguage('sv');
    
    expect(screen.getByRole('heading', { name: /glömt lösenord/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /skicka/i })).toBeInTheDocument();
    
    // Change back to English
    await i18n.changeLanguage('en');
    
    expect(screen.getByRole('heading', { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});
