import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from '../contexts/AuthContext';
import i18n from '../i18n';
import CommunityList from './CommunityList';
import api from '../api';

// Mock API
jest.mock('../api');

const mockCommunities = [
  {
    id: 1,
    name: 'Test Community 1',
    description: 'Description 1',
    member_count: 100,
    active: true
  },
  {
    id: 2,
    name: 'Test Community 2',
    description: 'Description 2',
    member_count: 200,
    active: true
  }
];

const renderCommunityList = () => {
  return render(
    <BrowserRouter>
      <ChakraProvider>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <CommunityList />
          </AuthProvider>
        </I18nextProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
};

describe('CommunityList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: mockCommunities });
  });

  test('renders loading state initially', () => {
    renderCommunityList();
    expect(screen.getByText(new RegExp(i18n.t('communities.loading'), 'i'))).toBeInTheDocument();
  });

  test('renders communities after loading', async () => {
    renderCommunityList();

    await waitFor(() => {
      mockCommunities.forEach(community => {
        expect(screen.getByText(community.name)).toBeInTheDocument();
        expect(screen.getByText(community.description)).toBeInTheDocument();
      });
    });
  });

  test('handles failed API request', async () => {
    api.get.mockRejectedValue(new Error('Failed to fetch communities'));
    renderCommunityList();

    await waitFor(() => {
      expect(screen.getByText(/error fetching communities/i)).toBeInTheDocument();
    });
  });

  test('displays member count for each community', async () => {
    renderCommunityList();

    await waitFor(() => {
      mockCommunities.forEach(community => {
        expect(screen.getByText(new RegExp(community.member_count.toString()))).toBeInTheDocument();
      });
    });
  });

  test('filters communities by search term', async () => {
    renderCommunityList();

    await waitFor(() => {
      expect(screen.getByText('Test Community 1')).toBeInTheDocument();
      expect(screen.getByText('Test Community 2')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search communities/i);
    fireEvent.change(searchInput, { target: { value: 'Community 1' } });

    expect(screen.getByText('Test Community 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Community 2')).not.toBeInTheDocument();
  });

  test('handles empty community list', async () => {
    api.get.mockResolvedValue({ data: [] });
    renderCommunityList();

    await waitFor(() => {
      expect(screen.getByText(/no communities found/i)).toBeInTheDocument();
    });
  });

  test('sorts communities by member count', async () => {
    renderCommunityList();

    await waitFor(() => {
      const sortButton = screen.getByRole('button', { name: /sort by members/i });
      fireEvent.click(sortButton);

      const communityNames = screen.getAllByRole('heading')
        .map(heading => heading.textContent);
      expect(communityNames[0]).toBe('Test Community 2'); // Higher member count
      expect(communityNames[1]).toBe('Test Community 1'); // Lower member count
    });
  });

  test('filters active/inactive communities', async () => {
    const mockCommunitiesWithInactive = [
      ...mockCommunities,
      {
        id: 3,
        name: 'Inactive Community',
        description: 'Inactive',
        member_count: 0,
        active: false
      }
    ];
    api.get.mockResolvedValue({ data: mockCommunitiesWithInactive });
    
    renderCommunityList();

    await waitFor(() => {
      const statusFilter = screen.getByRole('combobox', { name: /status filter/i });
      fireEvent.change(statusFilter, { target: { value: 'active' } });

      expect(screen.queryByText('Inactive Community')).not.toBeInTheDocument();
      expect(screen.getByText('Test Community 1')).toBeInTheDocument();
    });
  });

  test('handles language switching', async () => {
    renderCommunityList();

    // Change language to Swedish
    await i18n.changeLanguage('sv');
    
    expect(screen.getByText(/gemenskaper/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/sök gemenskaper/i)).toBeInTheDocument();
    
    // Change back to English
    await i18n.changeLanguage('en');
    
    expect(screen.getByText(/communities/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search communities/i)).toBeInTheDocument();
  });

  test('navigates to community details on click', async () => {
    renderCommunityList();

    await waitFor(() => {
      const communityCard = screen.getByText('Test Community 1')
        .closest('a');
      expect(communityCard).toHaveAttribute('href', '/communities/1');
    });
  });

  test('displays community creation date', async () => {
    const mockCommunitiesWithDates = mockCommunities.map(community => ({
      ...community,
      created_at: '2024-01-01T00:00:00.000Z'
    }));
    api.get.mockResolvedValue({ data: mockCommunitiesWithDates });
    
    renderCommunityList();

    await waitFor(() => {
      expect(screen.getAllByText(/january 1, 2024/i)).toHaveLength(2);
    });
  });
});
