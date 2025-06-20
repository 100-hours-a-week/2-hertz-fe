export const isAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem('accessToken');
  const hasLoggedIn = localStorage.getItem('hasLoggedIn') === 'true';
  return Boolean(accessToken && hasLoggedIn);
};
