'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--background', '222.2% 84% 4.9%');
      root.style.setProperty('--foreground', '210% 40% 98%');
      root.style.setProperty('--card', '222.2% 84% 4.9%');
      root.style.setProperty('--card-foreground', '210% 40% 98%');
      root.style.setProperty('--popover', '222.2% 84% 4.9%');
      root.style.setProperty('--popover-foreground', '210% 40% 98%');
      root.style.setProperty('--primary', '210% 40% 98%');
      root.style.setProperty('--primary-foreground', '222.2% 84% 4.9%');
      root.style.setProperty('--secondary', '217.2% 32.6% 17.5%');
      root.style.setProperty('--secondary-foreground', '210% 40% 98%');
      root.style.setProperty('--muted', '217.2% 32.6% 17.5%');
      root.style.setProperty('--muted-foreground', '215% 20.2% 65.1%');
      root.style.setProperty('--accent', '217.2% 32.6% 17.5%');
      root.style.setProperty('--accent-foreground', '210% 40% 98%');
      root.style.setProperty('--destructive', '0% 62.8% 30.6%');
      root.style.setProperty('--destructive-foreground', '210% 40% 98%');
      root.style.setProperty('--border', '217.2% 32.6% 17.5%');
      root.style.setProperty('--input', '217.2% 32.6% 17.5%');
      root.style.setProperty('--ring', '212.7% 26.8% 83.9%');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--background', '0% 0% 100%');
      root.style.setProperty('--foreground', '222.2% 84% 4.9%');
      root.style.setProperty('--card', '0% 0% 100%');
      root.style.setProperty('--card-foreground', '222.2% 84% 4.9%');
      root.style.setProperty('--popover', '0% 0% 100%');
      root.style.setProperty('--popover-foreground', '222.2% 84% 4.9%');
      root.style.setProperty('--primary', '222.2% 47.4% 11.2%');
      root.style.setProperty('--primary-foreground', '210% 40% 98%');
      root.style.setProperty('--secondary', '210% 40% 96%');
      root.style.setProperty('--secondary-foreground', '222.2% 84% 4.9%');
      root.style.setProperty('--muted', '210% 40% 96%');
      root.style.setProperty('--muted-foreground', '215.4% 16.3% 46.9%');
      root.style.setProperty('--accent', '210% 40% 96%');
      root.style.setProperty('--accent-foreground', '222.2% 84% 4.9%');
      root.style.setProperty('--destructive', '0% 84.2% 60.2%');
      root.style.setProperty('--destructive-foreground', '210% 40% 98%');
      root.style.setProperty('--border', '214.3% 31.8% 91.4%');
      root.style.setProperty('--input', '214.3% 31.8% 91.4%');
      root.style.setProperty('--ring', '222.2% 84% 4.9%');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}