import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Admin from '../pages/Admin';
import * as authHook from '../hooks/useAuth';

// Mock the components that Admin renders
vi.mock('../components/admin/ProjectsManager', () => ({
  default: () => <div data-testid="projects-manager" />
}));
vi.mock('../components/admin/TeamManager', () => ({
  default: () => <div data-testid="team-manager" />
}));
vi.mock('../components/admin/GlobalSettingsManager', () => ({
  default: () => <div data-testid="global-settings-manager" />
}));
vi.mock('../components/admin/ContactSubmissions', () => ({
  default: () => <div data-testid="contact-submissions" />
}));
vi.mock('../components/admin/AdminSettings', () => ({
  default: () => <div data-testid="admin-settings" />
}));

describe('Admin Panel', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading state when auth is loading', () => {
    vi.spyOn(authHook, 'useAuth').mockReturnValue({
      user: null,
      isAdmin: false,
      loading: true,
      signOut: vi.fn(),
      signIn: vi.fn(),
      session: null,
    });

    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders admin UI when user is authenticated and admin', () => {
    vi.spyOn(authHook, 'useAuth').mockReturnValue({
      user: { id: '1', email: 'admin@example.com' } as unknown as import('@supabase/supabase-js').User,
      isAdmin: true,
      loading: false,
      signOut: vi.fn(),
      signIn: vi.fn(),
      session: null,
    });

    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    expect(screen.getByText('ProtoNN')).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByTestId('projects-manager')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
  });

  it('returns null if user is not authenticated or not admin', () => {
    vi.spyOn(authHook, 'useAuth').mockReturnValue({
      user: null,
      isAdmin: false,
      loading: false,
      signOut: vi.fn(),
      signIn: vi.fn(),
      session: null,
    });

    const { container } = render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });
});
