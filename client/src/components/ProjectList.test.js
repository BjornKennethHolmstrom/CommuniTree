import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from '../contexts/AuthContext';
import { CommunityProvider } from '../contexts/CommunityContext';
import { ErrorProvider } from '../contexts/ErrorContext';
import i18n from '../i18n';
import ProjectList from './ProjectList';

const mockUser = { id: 1, token: 'mock-token' };
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

const mockActiveCommunities = [
  { id: 1, name: 'Community 1', theme: { primaryColor: '#3182ce' } },
  { id: 2, name: 'Community 2', theme: { primaryColor: '#38A169' } }
];

jest.mock('../contexts/CommunityContext', () => ({
  useCommunity: () => ({
    activeCommunities: mockActiveCommunities
  }),
  CommunityProvider: ({ children }) => <div>{children}</div>
}));

const mockProjects = {
  projects: [
    {
      id: 1,
      title: 'Test Project 1',
      description: 'Description 1',
      status: 'open',
      community_id: 1
    },
    {
      id: 2,
      title: 'Test Project 2',
      description: 'Description 2',
      status: 'in_progress',
      community_id: 2
    }
  ],
  currentPage: 1,
  totalPages: 1,
  totalProjects: 2
};

const mockFetch = jest.fn();
global.fetch = mockFetch;

const renderProjectList = () => {
  return render(
    <BrowserRouter>
      <ChakraProvider>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <ErrorProvider>
              <CommunityProvider>
                <ProjectList />
              </CommunityProvider>
            </ErrorProvider>
          </AuthProvider>
        </I18nextProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
};

describe('ProjectList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProjects)
    });
  });

  test('renders loading state initially', () => {
    renderProjectList();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders project list after loading', async () => {
    renderProjectList();

    await waitFor(() => {
      mockProjects.projects.forEach(project => {
        expect(screen.getByText(project.title)).toBeInTheDocument();
        expect(screen.getByText(project.description)).toBeInTheDocument();
      });
    });
  });

  test('displays create project button when communities are selected', async () => {
    renderProjectList();

    await waitFor(() => {
      expect(screen.getByText(/create new/i)).toBeInTheDocument();
    });
  });

  test('filters projects by search term', async () => {
    renderProjectList();

    const searchInput = await screen.findByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Project 1' } });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('search=Project%201'),
        expect.any(Object)
      );
    });
  });

  test('filters projects by status', async () => {
    renderProjectList();

    const statusSelect = await screen.findByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'open' } });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('filter=open'),
        expect.any(Object)
      );
    });
  });

  test('handles pagination', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        ...mockProjects,
        currentPage: 1,
        totalPages: 2
      })
    });

    renderProjectList();

    const loadMoreButton = await screen.findByText(/load more/i);
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.any(Object)
      );
    });
  });

  test('displays community badges on projects', async () => {
    renderProjectList();

    await waitFor(() => {
      mockProjects.projects.forEach(project => {
        const communityName = mockActiveCommunities.find(
          c => c.id === project.community_id
        ).name;
        expect(screen.getByText(communityName)).toBeInTheDocument();
      });
    });
  });

  test('handles error state', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'));
    renderProjectList();

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test('navigates to project details on click', async () => {
    renderProjectList();

    const projectTitle = await screen.findByText('Test Project 1');
    const projectLink = projectTitle.closest('a');
    expect(projectLink).toHaveAttribute('href', '/projects/1');
  });

  test('handles language switching', async () => {
    renderProjectList();

    // Change language to Swedish
    await i18n.changeLanguage('sv');
    
    expect(screen.getByText(/skapa ny/i)).toBeInTheDocument();
    expect(screen.getByText(/sök/i)).toBeInTheDocument();
    
    // Change back to English
    await i18n.changeLanguage('en');
    
    expect(screen.getByText(/create new/i)).toBeInTheDocument();
    expect(screen.getByText(/search/i)).toBeInTheDocument();
  });
});
