'use client'
import 'dayjs/locale/zh-cn';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { type ReactNode } from 'react';

dayjs.extend(utc);
dayjs.extend(timezone);
// 引入处理相对时间的插件
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

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