'use client'
import { HeroUIProvider } from '@heroui/react';
import { type ReactNode } from 'react';

type ProvidersProps = {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <HeroUIProvider >
      {children}
    </HeroUIProvider>
  )
}