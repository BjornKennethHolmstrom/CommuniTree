import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useParams } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import ResetPassword from './ResetPassword';

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: () => jest.fn(),
}));

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

const renderResetPasswordWithProviders = () => {
  return render(
    <BrowserRouter>
      <ChakraProvider>
        <I18nextProvider i18n={i18n}>
          <ResetPassword />
        </I18nextProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
};

describe('ResetPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set default mock token
    useParams.mockReturnValue({ token: 'valid-token' });
  });

  test('validates token on mount', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ msg: 'Valid token' }),
      })
    );

    renderResetPasswordWithProviders();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/auth/verify-reset-token/valid-token',
        expect.any(Object)
      );
    });
  });

  test('displays error for invalid token', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ msg: 'Invalid or expired token' }),
      })
    );

    renderResetPasswordWithProviders();

    expect(await screen.findByText(/invalid or expired token/i)).toBeInTheDocument();
    expect(screen.getByText(/request new link/i)).toBeInTheDocument();
  });

  test('validates password requirements', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ msg: 'Valid token' }),
      })
    );

    renderResetPasswordWithProviders();

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Test password length
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(submitButton);
    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();

    // Test password strength
    fireEvent.change(passwordInput, { target: { value: 'longpassword' } });
    fireEvent.click(submitButton);
    expect(await screen.findByText(/password must contain at least one number/i)).toBeInTheDocument();

    // Test password match
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmInput, { target: { value: 'Password124' } });
    fireEvent.click(submitButton);
    expect(await screen.findByText(/passwords must match/i)).toBeInTheDocument();
  });

  test('handles successful password reset', async () => {
    mockFetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ msg: 'Valid token' }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ msg: 'Password successfully reset' }),
        })
      );

    renderResetPasswordWithProviders();

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(passwordInput, { target: { value: 'NewPassword123' } });
    fireEvent.change(confirmInput, { target: { value: 'NewPassword123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/auth/reset-password/valid-token',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ password: 'NewPassword123' }),
        })
      );
    });

    expect(await screen.findByText(/password successfully reset/i)).toBeInTheDocument();
  });

  test('handles reset error', async () => {
    mockFetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ msg: 'Valid token' }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ msg: 'Error resetting password' }),
        })
      );

    renderResetPasswordWithProviders();

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(passwordInput, { target: { value: 'NewPassword123' } });
    fireEvent.change(confirmInput, { target: { value: 'NewPassword123' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/error resetting password/i)).toBeInTheDocument();
  });

  test('toggles password visibility', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ msg: 'Valid token' }),
      })
    );

    renderResetPasswordWithProviders();

    const passwordInput = screen.getByLabelText(/new password/i);
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('handles language switching', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ msg: 'Valid token' }),
      })
    );

    renderResetPasswordWithProviders();
    
    // Change language to Swedish
    await i18n.changeLanguage('sv');
    
    expect(screen.getByRole('heading', { name: /återställ lösenord/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nytt lösenord/i)).toBeInTheDocument();
    
    // Change back to English
    await i18n.changeLanguage('en');
    
    expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
  });

  test('redirects to login after successful reset', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    mockFetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ msg: 'Valid token' }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ msg: 'Password successfully reset' }),
        })
      );

    renderResetPasswordWithProviders();

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(passwordInput, { target: { value: 'NewPassword123' } });
    fireEvent.change(confirmInput, { target: { value: 'NewPassword123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
