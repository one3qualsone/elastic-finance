'use client';

import { ThemeProvider } from 'next-themes';
import { StockDataProvider } from '@/contexts/StockDataContext';
import { EducationalContentProvider } from '@/contexts/EducationalContentContext';

// This component combines all context providers in one place
export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class">
      <StockDataProvider>
        <EducationalContentProvider>
          {children}
        </EducationalContentProvider>
      </StockDataProvider>
    </ThemeProvider>
  );
}