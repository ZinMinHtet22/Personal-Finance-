import { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.theme) {
          setThemeState(user.theme as Theme);
        }
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme, isLoaded]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      await client.put('/user/settings', { theme: newTheme });
      // update local storage
      const savedUser = localStorage.getItem('nexus_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        user.theme = newTheme;
        localStorage.setItem('nexus_user', JSON.stringify(user));
        window.dispatchEvent(new Event('userUpdated'));
      }
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
