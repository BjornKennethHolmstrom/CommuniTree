import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from '../contexts/AuthContext';
import i18n from '../i18n';
import CreateProject from './CreateProject';

const mockUser = { id: 1, token: 'mock-token' };
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderCreateProject = () => {
  return render(
    <BrowserRouter>
      <ChakraProvider>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <CreateProject />
          </AuthProvider>
        </I18nextProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
};

describe('CreateProject Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders create project form', () => {
    renderCreateProject();

    expect(screen.getByRole('heading', { name: /create project/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  test('handles successful project creation', async () => {
    mockFetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 1, title: 'New Project' })
    }));

    renderCreateProject();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Project' }
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Project Description' }
    });
    fireEvent.change(screen.getByLabelText(/required skills/i), {
      target: { value: 'React, Node.js' }
    });
    fireEvent.change(screen.getByLabelText(/time commitment/i), {
      target: { value: '10 hours/week' }
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'Remote' }
    });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/projects',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'x-auth-token': mockUser.token
          }),
          body: expect.any(String)
        })
      );
      expect(screen.getByText(/project created successfully/i)).toBeInTheDocument();
    });
  });

  test('displays error message on failed creation', async () => {
    mockFetch.mockImplementationOnce(() => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ error: 'Error creating project' })
    }));

    renderCreateProject();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Project' }
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Project Description' }
    });
    fireEvent.change(screen.getByLabelText(/required skills/i), {
      target: { value: 'React, Node.js' }
    });
    fireEvent.change(screen.getByLabelText(/time commitment/i), {
      target: { value: '10 hours/week' }
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'Remote' }
    });

    fireEvent.submit(screen.getByRole('form'));

    expect(await screen.findByText(/error creating project/i)).toBeInTheDocument();
  });

  test('shows loading state during submission', async () => {
    mockFetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => {
      resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, title: 'New Project' })
      });
    }, 100)));

    renderCreateProject();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Project' }
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Project Description' }
    });
    fireEvent.change(screen.getByLabelText(/required skills/i), {
      target: { value: 'React, Node.js' }
    });
    fireEvent.change(screen.getByLabelText(/time commitment/i), {
      target: { value: '10 hours/week' }
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'Remote' }
    });

    fireEvent.submit(screen.getByRole('form'));

    expect(await screen.findByRole('button', { name: /loading/i })).toBeDisabled();
  });

  test('navigates to project list after successful creation', async () => {
    mockFetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 1, title: 'New Project' })
    }));

    renderCreateProject();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Project' }
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Project Description' }
    });
    fireEvent.change(screen.getByLabelText(/required skills/i), {
      target: { value: 'React, Node.js' }
    });
    fireEvent.change(screen.getByLabelText(/time commitment/i), {
      target: { value: '10 hours/week' }
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'Remote' }
    });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/projects');
    });
  });

  test('handles network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    renderCreateProject();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Project' }
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Project Description' }
    });
    fireEvent.change(screen.getByLabelText(/required skills/i), {
      target: { value: 'React, Node.js' }
    });
    fireEvent.change(screen.getByLabelText(/time commitment/i), {
      target: { value: '10 hours/week' }
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'Remote' }
    });

    fireEvent.submit(screen.getByRole('form'));

    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });

  test('handles language switching', async () => {
    renderCreateProject();

    // Change language to Swedish
    await i18n.changeLanguage('sv');
    
    expect(screen.getByRole('heading', { name: /skapa projekt/i })).toBeInTheDocument();
    expect(screen.getByText(/titel/i)).toBeInTheDocument();
    
    // Change back to English
    await i18n.changeLanguage('en');
    
    expect(screen.getByRole('heading', { name: /create project/i })).toBeInTheDocument();
    expect(screen.getByText(/title/i)).toBeInTheDocument();
  });
});
