/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-08 17:12:20
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-15 10:35:50
 * @Description: 默认布局
 */
import { NextUIProvider } from '@nextui-org/react';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import Footer from '@/components/Footer'; // 底部版权
import Header from '@/components/Header'; // 头部布局

import type { HotListConfig } from '@/utils/types';

import { hotCardConfig } from '@/utils';

import type { Metadata } from 'next';

import './globals.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `${process.env.SITE_TITLE} - ${process.env.SITE_DESCRIPTION}`, // 网站标题
  description: hotCardConfig.map((item: HotListConfig) => `${item.label}${item.tip}`).join(','), // 网站描述
  applicationName: process.env.PROJECT_NAME, // 应用名称
  authors: { name: process.env.AUTHOR_NAME, url: process.env.AUTHOR_BLOG }, // 网站作者
  verification: { other: { 'baidu-site-verification': 'codeva-kYzuuOyYCZ' } }, // 网站验证
  keywords: process.env.SITE_KEYWORDS, // 网站关键词
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`overflow-x-hidden ${inter.className}`}>
        <NextUIProvider>
          {/* 主体内容 */}
          <ThemeProvider attribute="class" defaultTheme={process.env.DEFAULT_THEME}>
            {/* 头部布局 */}
            <Header />
            <main>{children}</main>
            {/* 底部版权 */}
            <Footer />
          </ThemeProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
