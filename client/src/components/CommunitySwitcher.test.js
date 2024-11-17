import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';
import { CommunityProvider } from '../contexts/CommunityContext';
import i18n from '../i18n';
import CommunitySwitcher from './CommunitySwitcher';

// Mock community context
const mockActiveCommunities = [
  { id: 1, name: 'Active Community 1', member_count: 100 },
  { id: 2, name: 'Active Community 2', member_count: 200 }
];

const mockAvailableCommunities = [
  ...mockActiveCommunities,
  { id: 3, name: 'Available Community 3', member_count: 300 },
  { id: 4, name: 'Available Community 4', member_count: 400 }
];

const mockToggleCommunity = jest.fn();
const mockJoinCommunity = jest.fn();
const mockLoading = false;

jest.mock('../contexts/CommunityContext', () => ({
  useCommunity: () => ({
    activeCommunities: mockActiveCommunities,
    availableCommunities: mockAvailableCommunities,
    toggleCommunity: mockToggleCommunity,
    joinCommunity: mockJoinCommunity,
    loading: mockLoading
  }),
  CommunityProvider: ({ children }) => <div>{children}</div>
}));

const renderCommunitySwitcherWithProviders = () => {
  return render(
    <ChakraProvider>
      <I18nextProvider i18n={i18n}>
        <CommunityProvider>
          <CommunitySwitcher />
        </CommunityProvider>
      </I18nextProvider>
    </ChakraProvider>
  );
};

describe('CommunitySwitcher Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders community selector button', () => {
    renderCommunitySwitcherWithProviders();
    
    expect(screen.getByRole('button', { 
      name: new RegExp(i18n.t('community.selector.title'), 'i')
    })).toBeInTheDocument();
  });

  test('displays active communities count', () => {
    renderCommunitySwitcherWithProviders();
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(mockActiveCommunities.length.toString());
  });

  test('opens popover on button click', async () => {
    renderCommunitySwitcherWithProviders();
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
      mockAvailableCommunities.forEach(community => {
        expect(screen.getByText(community.name)).toBeInTheDocument();
      });
    });
  });

  test('filters communities based on search input', async () => {
    renderCommunitySwitcherWithProviders();
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'Community 1' } });

    await waitFor(() => {
      expect(screen.getByText('Active Community 1')).toBeInTheDocument();
      expect(screen.queryByText('Active Community 2')).not.toBeInTheDocument();
    });
  });

  test('handles community toggle', async () => {
    renderCommunitySwitcherWithProviders();
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    const communityToggle = screen.getAllByRole('button').find(
      button => button.getAttribute('aria-label') === i18n.t('community.selector.removeFromActive')
    );

    fireEvent.click(communityToggle);

    expect(mockToggleCommunity).toHaveBeenCalledWith(mockActiveCommunities[0].id);
  });

  test('handles joining new community', async () => {
    renderCommunitySwitcherWithProviders();
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    const joinButton = screen.getAllByRole('button').find(
      button => button.textContent === i18n.t('community.selector.join')
    );

    fireEvent.click(joinButton);

    expect(mockJoinCommunity).toHaveBeenCalled();
  });

  test('displays loading state', () => {
    jest.mock('../contexts/CommunityContext', () => ({
      useCommunity: () => ({
        ...jest.requireActual('../contexts/CommunityContext').useCommunity(),
        loading: true
      })
    }));

    renderCommunitySwitcherWithProviders();
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('handles clear selection', async () => {
    renderCommunitySwitcherWithProviders();
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    const clearButton = screen.getByRole('button', { 
      name: new RegExp(i18n.t('community.selector.clearSelection'), 'i')
    });

    fireEvent.click(clearButton);

    expect(mockToggleCommunity).toHaveBeenCalledWith(
      expect.arrayContaining(mockActiveCommunities.map(c => c.id))
    );
  });

  test('handles language switching', async () => {
    renderCommunitySwitcherWithProviders();
    
    // Change language to Swedish
    await i18n.changeLanguage('sv');
    
    expect(screen.getByRole('button', { name: /välj gemenskap/i })).toBeInTheDocument();
    
    // Change back to English
    await i18n.changeLanguage('en');
    
    expect(screen.getByRole('button', { name: /select community/i })).toBeInTheDocument();
  });

  test('displays member count for each community', async () => {
    renderCommunitySwitcherWithProviders();
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    mockAvailableCommunities.forEach(community => {
      expect(screen.getByText(new RegExp(community.member_count.toString()))).toBeInTheDocument();
    });
  });
});
