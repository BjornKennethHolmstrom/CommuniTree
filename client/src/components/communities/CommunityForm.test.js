import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import CommunityForm from './CommunityForm';

const mockOnSubmit = jest.fn();
const mockCommunity = {
  name: 'Test Community',
  description: 'Test Description',
  guidelines: 'Test Guidelines',
  active: true,
  location: 'Test Location',
  timezone: 'UTC'
};

const renderCommunityForm = (community = null) => {
  return render(
    <ChakraProvider>
      <I18nextProvider i18n={i18n}>
        <CommunityForm 
          community={community} 
          onSubmit={mockOnSubmit} 
        />
      </I18nextProvider>
    </ChakraProvider>
  );
};

describe('CommunityForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders empty form in create mode', () => {
    renderCommunityForm();

    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
    expect(screen.getByLabelText(/guidelines/i)).toHaveValue('');
    expect(screen.getByLabelText(/location/i)).toHaveValue('');
    expect(screen.getByLabelText(/timezone/i)).toHaveValue(
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    expect(screen.getByRole('switch', { name: /active/i })).toBeChecked();
  });

  test('renders form with community data in edit mode', () => {
    renderCommunityForm(mockCommunity);

    expect(screen.getByLabelText(/name/i)).toHaveValue(mockCommunity.name);
    expect(screen.getByLabelText(/description/i)).toHaveValue(mockCommunity.description);
    expect(screen.getByLabelText(/guidelines/i)).toHaveValue(mockCommunity.guidelines);
    expect(screen.getByLabelText(/location/i)).toHaveValue(mockCommunity.location);
    expect(screen.getByLabelText(/timezone/i)).toHaveValue(mockCommunity.timezone);
    expect(screen.getByRole('switch', { name: /active/i })).toBeChecked();
  });

  test('validates required fields', async () => {
    renderCommunityForm();

    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    renderCommunityForm();

    fireEvent.change(screen.getByLabelText(/name/i), { 
      target: { value: mockCommunity.name } 
    });
    fireEvent.change(screen.getByLabelText(/description/i), { 
      target: { value: mockCommunity.description } 
    });
    fireEvent.change(screen.getByLabelText(/guidelines/i), { 
      target: { value: mockCommunity.guidelines } 
    });
    fireEvent.change(screen.getByLabelText(/location/i), { 
      target: { value: mockCommunity.location } 
    });

    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: mockCommunity.name,
        description: mockCommunity.description,
        guidelines: mockCommunity.guidelines,
        location: mockCommunity.location,
        active: true
      }));
    });
  });

  test('handles cancel action', () => {
    renderCommunityForm();

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnSubmit).toHaveBeenCalledWith(null);
  });

  test('toggles active status', () => {
    renderCommunityForm(mockCommunity);

    const activeSwitch = screen.getByRole('switch', { name: /active/i });
    fireEvent.click(activeSwitch);
    expect(activeSwitch).not.toBeChecked();
  });

  test('handles language switching', async () => {
    renderCommunityForm();

    // Change language to Swedish
    await i18n.changeLanguage('sv');
    
    expect(screen.getByText(/namn/i)).toBeInTheDocument();
    expect(screen.getByText(/beskrivning/i)).toBeInTheDocument();
    
    // Change back to English
    await i18n.changeLanguage('en');
    
    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/description/i)).toBeInTheDocument();
  });
});
