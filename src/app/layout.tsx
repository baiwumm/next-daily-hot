/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-08 17:12:20
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-20 14:47:04
 * @Description: 默认布局
 */
import { NextUIProvider } from '@nextui-org/react';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import BaiDuAnalytics from '@/components/Analytics/BaiDuAnalytics'; // 百度统计
import GoogleUtilities from '@/components/Analytics/GoogleUtilities'; // 谷歌统计
import MicrosoftClarity from '@/components/Analytics/MicrosoftClarity'; // Microsoft Clarity
import UmamiAnalytics from '@/components/Analytics/UmamiAnalytics'; // Umami Analytics
import Footer from '@/components/Footer'; // 底部版权
import FullLoading from '@/components/FullLoading'; // 全局 Loading
import Header from '@/components/Header'; // 头部布局

import type { HotListConfig } from '@/utils/types';

import { hotCardConfig } from '@/utils';

import type { Metadata, Viewport } from 'next';

import './globals.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `${process.env.SITE_TITLE} - ${process.env.SITE_DESCRIPTION}`, // 网站标题
  description: process.env.SITE_DESCRIPTION, // 网站描述
  applicationName: process.env.PROJECT_NAME, // 应用名称
  authors: { name: process.env.AUTHOR_NAME, url: process.env.AUTHOR_BLOG }, // 网站作者
  verification: {
    other: { 'baidu-site-verification': 'codeva-kYzuuOyYCZ', 'bytedance-verification-code': 'oPgCIrgBz/3Lhr9BoNE2' },
  }, // 网站验证
  keywords: hotCardConfig.map((item: HotListConfig) => `${item.label}${item.tip}`).join(','), // 网站关键词
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: process.env.SITE_URL,
    title: process.env.SITE_TITLE,
    description: process.env.SITE_DESCRIPTION,
    siteName: process.env.SITE_TITLE,
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.SITE_TITLE,
    description: process.env.SITE_DESCRIPTION,
    images: [`${process.env.SITE_URL}/og.png`],
    creator: process.env.GITHUB_USERNAME,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff' },
    { media: '(prefers-color-scheme: dark)', color: '#000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 百度统计 */}
      <BaiDuAnalytics />
      {/* 微软分析 Clarity 代码 */}
      <MicrosoftClarity />
      {/* 谷歌统计 */}
      <GoogleUtilities />
      {/* umami - 站点统计分析 */}
      <UmamiAnalytics />
      <body className={inter.className}>
        <NextUIProvider>
          {/* 主体内容 */}
          <ThemeProvider attribute="class" defaultTheme={process.env.DEFAULT_THEME}>
            {/* 全局 Loading */}
            <FullLoading />
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
