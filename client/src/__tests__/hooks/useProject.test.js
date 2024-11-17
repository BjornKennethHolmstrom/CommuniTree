import { renderHook, act } from '@testing-library/react-hooks';
import { useProject } from '../hooks/useProject';
import { AuthProvider } from '../contexts/AuthContext';
import { CommunityProvider } from '../contexts/CommunityContext';

const mockUser = { id: 1, token: 'mock-token' };
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
  AuthProvider: ({ children }) => children
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useProject Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches project data successfully', async () => {
    const mockProject = {
      id: 1,
      title: 'Test Project',
      description: 'Test Description'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProject)
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useProject('1'),
      {
        wrapper: ({ children }) => (
          <AuthProvider>
            <CommunityProvider>
              {children}
            </CommunityProvider>
          </AuthProvider>
        )
      }
    );

    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.project).toEqual(mockProject);
    expect(result.current.error).toBeNull();
  });

  test('handles project fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch project'));

    const { result, waitForNextUpdate } = renderHook(
      () => useProject('1'),
      {
        wrapper: ({ children }) => (
          <AuthProvider>
            <CommunityProvider>
              {children}
            </CommunityProvider>
          </AuthProvider>
        )
      }
    );

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.project).toBeNull();
    expect(result.current.error).toBe('Failed to fetch project');
  });

  test('updates project data', async () => {
    const mockProject = {
      id: 1,
      title: 'Test Project',
      description: 'Test Description'
    };

    const updatedProject = {
      ...mockProject,
      title: 'Updated Project'
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProject)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedProject)
      });

    const { result, waitForNextUpdate } = renderHook(
      () => useProject('1'),
      {
        wrapper: ({ children }) => (
          <AuthProvider>
            <CommunityProvider>
              {children}
            </CommunityProvider>
          </AuthProvider>
        )
      }
    );

    await waitForNextUpdate();

    act(() => {
      result.current.updateProject({ title: 'Updated Project' });
    });

    await waitForNextUpdate();

    expect(result.current.project).toEqual(updatedProject);
  });

  test('handles volunteer signup', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 1, title: 'Test Project' })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Successfully signed up' })
      });

    const { result, waitForNextUpdate } = renderHook(
      () => useProject('1'),
      {
        wrapper: ({ children }) => (
          <AuthProvider>
            <CommunityProvider>
              {children}
            </CommunityProvider>
          </AuthProvider>
        )
      }
    );

    await waitForNextUpdate();

    act(() => {
      result.current.signUpVolunteer();
    });

    await waitForNextUpdate();

    expect(result.current.volunteerStatus).toBe('signed_up');
  });

  test('cleans up on unmount', async () => {
    const { result, unmount } = renderHook(
      () => useProject('1'),
      {
        wrapper: ({ children }) => (
          <AuthProvider>
            <CommunityProvider>
              {children}
            </CommunityProvider>
          </AuthProvider>
        )
      }
    );

    unmount();

    expect(result.current.project).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
