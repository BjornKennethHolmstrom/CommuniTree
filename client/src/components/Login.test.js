import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Make sure to import your i18n configuration

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const renderWithI18n = (component) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  );
};

test('renders login form', () => {
  renderWithI18n(<Login />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});

test('calls onSubmit with email and password', () => {
  const mockLogin = jest.fn();
  jest.mock('./AuthContext', () => ({
    useAuth: () => ({
      login: mockLogin,
    }),
  }));

  renderWithI18n(<Login />);
  
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
});
