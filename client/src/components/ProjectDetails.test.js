import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useParams } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from '../contexts/AuthContext';
import i18n from '../i18n';
import ProjectDetails from './ProjectDetails';

// Mock the router hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: () => jest.fn()
}));

const mockUser = { id: 1, token: 'mock-token', role: 'user' };
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

const mockProject = {
  id: 1,
  title: 'Test Project',
  description: 'Project Description',
  required_skills: ['React', 'Node.js'],
  time_commitment: '10 hours/week',
  location: 'Remote',
  status: 'open',
  creator_id: 1
};

const mockVolunteers = [
  { id: 2, name: 'Test Volunteer', role: 'Developer' }
];

const mockComments = [
  { id: 1, content: 'Test Comment', user_name: 'Commenter', created_at: new Date().toISOString() }
];

const mockFetch = jest.fn();
global.fetch = mockFetch;

const renderProjectDetails = () => {
  return render(
    <BrowserRouter>
      <ChakraProvider>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <ProjectDetails />
          </AuthProvider>
        </I18nextProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
};

describe('ProjectDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ id: '1' });

    // Mock API responses
    mockFetch
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProject)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockVolunteers)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockComments)
      }));
  });

  test('renders loading state initially', () => {
    renderProjectDetails();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders project details after loading', async () => {
    renderProjectDetails();

    await waitFor(() => {
      expect(screen.getByText(mockProject.title)).toBeInTheDocument();
      expect(screen.getByText(mockProject.description)).toBeInTheDocument();
      expect(screen.getByText(/react/i)).toBeInTheDocument();
      expect(screen.getByText(/node.js/i)).toBeInTheDocument();
      expect(screen.getByText(mockProject.time_commitment)).toBeInTheDocument();
      expect(screen.getByText(mockProject.location)).toBeInTheDocument();
    });
  });

  test('displays volunteer list', async () => {
    renderProjectDetails();

    await waitFor(() => {
      mockVolunteers.forEach(volunteer => {
        expect(screen.getByText(volunteer.name)).toBeInTheDocument();
        expect(screen.getByText(volunteer.role)).toBeInTheDocument();
      });
    });
  });

  test('handles volunteer signup', async () => {
    mockFetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Successfully signed up' })
    }));

    renderProjectDetails();

    const signupButton = await screen.findByText(/volunteer sign up/i);
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/projects/volunteer',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ project_id: '1' })
        })
      );
    });
  });

  test('shows edit/delete options for project owner', async () => {
    renderProjectDetails();

    await waitFor(() => {
      expect(screen.getByText(/edit/i)).toBeInTheDocument();
      expect(screen.getByText(/delete/i)).toBeInTheDocument();
    });
  });

  test('handles project status update', async () => {
    mockFetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ ...mockProject, status: 'in_progress' })
    }));

    renderProjectDetails();

    const statusSelect = await screen.findByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'in_progress' } });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/projects/1/status',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ status: 'in_progress' })
        })
      );
    });
  });

  test('displays file uploads section', async () => {
    renderProjectDetails();

    await waitFor(() => {
      expect(screen.getByText(/file uploads/i)).toBeInTheDocument();
    });
  });

  test('displays comments section', async () => {
    renderProjectDetails();

    await waitFor(() => {
      mockComments.forEach(comment => {
        expect(screen.getByText(comment.content)).toBeInTheDocument();
        expect(screen.getByText(comment.user_name)).toBeInTheDocument();
      });
    });
  });

  test('handles project deletion', async () => {
    window.confirm = jest.fn(() => true);
    mockFetch.mockImplementationOnce(() => Promise.resolve({
      ok: true
    }));

    renderProjectDetails();

    const deleteButton = await screen.findByText(/delete/i);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/projects/1',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });

  test('handles language switching', async () => {
    renderProjectDetails();

    // Change language to Swedish
    await i18n.changeLanguage('sv');
    
    expect(screen.getByText(/krävda färdigheter/i)).toBeInTheDocument();
    expect(screen.getByText(/tidsåtagande/i)).toBeInTheDocument();
    
    // Change back to English
    await i18n.changeLanguage('en');
    
    expect(screen.getByText(/required skills/i)).toBeInTheDocument();
    expect(screen.getByText(/time commitment/i)).toBeInTheDocument();
  });
});
