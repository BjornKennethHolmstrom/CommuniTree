import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useParams } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from '../contexts/AuthContext';
import { CommunityProvider } from '../contexts/CommunityContext';
import { ErrorProvider } from '../contexts/ErrorContext';
import i18n from '../i18n';
import CommunityLanding from './CommunityLanding';

// Mock router hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

// Mock user auth context
const mockUser = {
  id: 1,
  token: 'mock-token'
};

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

// Mock fetch responses
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Sample data
const mockCommunity = {
  id: 1,
  name: 'Test Community',
  description: 'A test community',
  cover_image_url: '/api/placeholder/1200/300',
  member_count: 100,
  tags: ['green', 'sustainable'],
  location: 'Test City',
};

const mockProjects = [
  { id: 1, title: 'Test Project', description: 'Project description', status: 'active' }
];

const mockEvents = [
  { id: 1, title: 'Test Event', description: 'Event description', start_time: new Date().toISOString() }
];

const mockMembers = [
  { id: 1, name: 'Test User', role: 'member', avatar_url: null }
];

const renderCommunityLandingWithProviders = () => {
  return render(
    <BrowserRouter>
      <ChakraProvider>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <ErrorProvider>
              <CommunityProvider>
                <CommunityLanding />
              </CommunityProvider>
            </ErrorProvider>
          </AuthProvider>
        </I18nextProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
};

describe('CommunityLanding Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ id: '1' });

    // Mock successful API responses
    mockFetch
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCommunity)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProjects)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvents)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMembers)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ isMember: false })
      }));
  });

  test('renders loading state initially', () => {
    renderCommunityLandingWithProviders();
    expect(screen.getByText(new RegExp(i18n.t('common.loading'), 'i'))).toBeInTheDocument();
  });

  test('renders community information after loading', async () => {
    renderCommunityLandingWithProviders();

    await waitFor(() => {
      expect(screen.getByText(mockCommunity.name)).toBeInTheDocument();
      expect(screen.getByText(mockCommunity.description)).toBeInTheDocument();
      expect(screen.getByText(String(mockCommunity.member_count))).toBeInTheDocument();
    });
  });

  test('displays community statistics correctly', async () => {
    renderCommunityLandingWithProviders();

    await waitFor(() => {
      expect(screen.getByText(new RegExp(mockCommunity.member_count))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(mockProjects.length))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(mockEvents.length))).toBeInTheDocument();
    });
  });

  test('handles join/leave community functionality', async () => {
    renderCommunityLandingWithProviders();

    const joinButton = await screen.findByRole('button', { 
      name: new RegExp(i18n.t('community.join'), 'i') 
    });
    
    // Mock join community API call
    mockFetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Successfully joined community' })
    }));

    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/communities/1/join',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'x-auth-token': mockUser.token
          })
        })
      );
    });
  });

  test('displays projects tab content', async () => {
    renderCommunityLandingWithProviders();

    const projectsTab = await screen.findByRole('tab', { 
      name: new RegExp(i18n.t('community.recentProjects'), 'i') 
    });
    
    fireEvent.click(projectsTab);

    await waitFor(() => {
      expect(screen.getByText(mockProjects[0].title)).toBeInTheDocument();
      expect(screen.getByText(mockProjects[0].description)).toBeInTheDocument();
    });
  });

  test('displays events tab content', async () => {
    renderCommunityLandingWithProviders();

    const eventsTab = await screen.findByRole('tab', { 
      name: new RegExp(i18n.t('community.upcomingEvents'), 'i') 
    });
    
    fireEvent.click(eventsTab);

    await waitFor(() => {
      expect(screen.getByText(mockEvents[0].title)).toBeInTheDocument();
      expect(screen.getByText(mockEvents[0].description)).toBeInTheDocument();
    });
  });

  test('displays members tab content', async () => {
    renderCommunityLandingWithProviders();

    const membersTab = await screen.findByRole('tab', { 
      name: new RegExp(i18n.t('community.members'), 'i') 
    });
    
    fireEvent.click(membersTab);

    await waitFor(() => {
      expect(screen.getByText(mockMembers[0].name)).toBeInTheDocument();
      expect(screen.getByText(mockMembers[0].role)).toBeInTheDocument();
    });
  });

  test('handles error states appropriately', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch community'));

    renderCommunityLandingWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test('handles language switching', async () => {
    renderCommunityLandingWithProviders();

    // Change language to Swedish
    await i18n.changeLanguage('sv');
    
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /kommande händelser/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /medlemmar/i })).toBeInTheDocument();
    });
    
    // Change back to English
    await i18n.changeLanguage('en');
    
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /upcoming events/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /members/i })).toBeInTheDocument();
    });
  });
});
