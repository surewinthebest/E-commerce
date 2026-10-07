import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AuthScreen from '@/src/app/(auth)/index';
import useSocialAuth from '@/src/hooks/useSocialAuth';

jest.mock('@/src/hooks/useSocialAuth');

const mockUseSocialAuth = useSocialAuth as jest.MockedFunction<typeof useSocialAuth>;

describe('AuthScreen Component', () => {
  const mockHandleSocialAuth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all essential elements correctly when not loading', async () => {
    // Mock hook return value for initial state
    mockUseSocialAuth.mockReturnValue({
      loadingStrategy: null,
      handleSocialAuth: mockHandleSocialAuth,
    });

    const { getByText } = await render(<AuthScreen />);

    // Check buttons render text
    expect(getByText('Continue with Google')).toBeTruthy();
    expect(getByText('Continue with Apple')).toBeTruthy();

    // Check legal terms render
    expect(getByText(/By signing up, you agree to our/i)).toBeTruthy();
    expect(getByText('Terms')).toBeTruthy();
    expect(getByText('Privacy Policy')).toBeTruthy();
    expect(getByText('Cookie Use')).toBeTruthy();
  });

  it('triggers handleSocialAuth with "oauth_google" when Google button is pressed', async () => {
    mockUseSocialAuth.mockReturnValue({
      loadingStrategy: null,
      handleSocialAuth: mockHandleSocialAuth,
    });

    const { getByText } = await render(<AuthScreen />);
    const googleButton = getByText('Continue with Google');

    fireEvent.press(googleButton);

    expect(mockHandleSocialAuth).toHaveBeenCalledTimes(1);
    expect(mockHandleSocialAuth).toHaveBeenCalledWith('oauth_google');
  });

  it('triggers handleSocialAuth with "oauth_apple" when Apple button is pressed', async () => {
    mockUseSocialAuth.mockReturnValue({
      loadingStrategy: null,
      handleSocialAuth: mockHandleSocialAuth,
    });

    const { getByText } = await render(<AuthScreen />);
    const appleButton = getByText('Continue with Apple');

    fireEvent.press(appleButton);

    expect(mockHandleSocialAuth).toHaveBeenCalledTimes(1);
    expect(mockHandleSocialAuth).toHaveBeenCalledWith('oauth_apple');
  });

  it('shows ActivityIndicator and disables buttons when Google authentication is loading', async () => {
    mockUseSocialAuth.mockReturnValue({
      loadingStrategy: 'oauth_google',
      handleSocialAuth: mockHandleSocialAuth,
    });

    const { queryByText, getByTestId } = await render(<AuthScreen />);

    // Google text should be hidden, replaced by spinner
    expect(queryByText('Continue with Google')).toBeNull();
    // Apple button text remains visible
    expect(queryByText('Continue with Apple')).toBeTruthy();

    // Check that ActivityIndicator is rendered
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('disables buttons while any authentication strategy is loading', async () => {
    mockUseSocialAuth.mockReturnValue({
      loadingStrategy: 'oauth_google',
      handleSocialAuth: mockHandleSocialAuth,
    });

    const { getByText } = await render(<AuthScreen />);
    
    // Press Apple button while Google is loading
    const appleButton = getByText('Continue with Apple');
    fireEvent.press(appleButton);

    // Should NOT trigger the mock because button is disabled
    expect(mockHandleSocialAuth).not.toHaveBeenCalled();
  });
});