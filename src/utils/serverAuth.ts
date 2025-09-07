import { cookies } from 'next/headers';

export const isServerAuthenticated = async (): Promise<boolean> => {
  if (typeof window !== 'undefined') return false;

  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken');
    return Boolean(refreshToken);
  } catch {
    return false;
  }
};
