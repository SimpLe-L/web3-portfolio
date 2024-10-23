import { useEffect } from 'react';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.body.classList.add('dark');
  }, []);

  return (
    { children }
  );
};

export default ThemeProvider;