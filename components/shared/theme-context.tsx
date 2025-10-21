'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const useResolvedTheme = () => {
  const { theme, systemTheme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    
    if (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) {
      setResolvedTheme('dark');
    } else {
      setResolvedTheme('light');
    }
  }, [theme, systemTheme]);


  return { resolvedTheme, mounted };
};