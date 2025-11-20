'use client'
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { type ReactNode } from 'react';

dayjs.extend(utc);
dayjs.extend(timezone);

type ProvidersProps = {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <HeroUIProvider >
      <ToastProvider placement='top-center' toastOffset={40} />
      {children}
    </HeroUIProvider>
  )
}