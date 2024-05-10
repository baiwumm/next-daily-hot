/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-08 17:12:20
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-10 16:32:21
 * @Description: 默认布局
 */
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import Header from '@/components/Header'; // 头部布局

import type { Metadata } from 'next';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `${process.env.SITE_TITLE} - ${process.env.SITE_DESCRIPTION}`, // 网站标题
  description: process.env.SITE_DESCRIPTION, // 网站描述
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
      <body className={inter.className}>
        {/* 主体内容 */}
        <ThemeProvider attribute="class" defaultTheme="light">
          {/* 头部布局 */}
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
