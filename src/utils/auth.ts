// Client-side authentication check
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;

  const accessToken = localStorage.getItem('accessToken');
  const hasLoggedIn = localStorage.getItem('hasLoggedIn') === 'true';
  return Boolean(accessToken && hasLoggedIn);
};

export const checkAuthStatus = (): boolean => {
  if (typeof window === 'undefined') {
    // Server-side: Cannot directly check cookies here, rely on middleware
    return false;
  }

  // Client-side
  return isAuthenticated();
};
