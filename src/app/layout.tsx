/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-19 15:55:09
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 16:14:01
 * @Description: 根布局文件
 */
import "./globals.css";

import { loadIcons } from '@iconify-icon/react';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from "next";
import Script from 'next/script';
import { ThemeProvider as NextThemesProvider } from "next-themes";

import BackTop from '@/components/BackTop'
import Footer from '@/components/Footer'
import FullLoading from '@/components/FullLoading'
import Header from '@/components/Header'
import { THEME_MODE } from '@/lib/constant'

import pkg from '../../package.json'
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} - ${process.env.NEXT_PUBLIC_APP_DESC}`, // 网站标题
  description: process.env.NEXT_PUBLIC_APP_DESC, // 网站描述
  applicationName: pkg.name, // 应用名称
  authors: { name: pkg.author.name, url: pkg.author.url }, // 网站作者
  verification: {
    other: { 'baidu-site-verification': 'codeva-kYzuuOyYCZ', 'bytedance-verification-code': 'oPgCIrgBz/3Lhr9BoNE2' },
  }, // 网站验证
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESC,
    siteName: process.env.NEXT_PUBLIC_APP_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESC,
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/og.png`],
    creator: pkg.author.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 预加载所有用到的图标
  loadIcons(['ri:close-circle-fill', 'ri:checkbox-circle-fill', 'ri:loop-right-line']);
  return (
    <html lang="zh" suppressHydrationWarning>
      {/* 引入字体文件 */}
      <head>
        <link rel="stylesheet" href="https://cdn.baiwumm.com/fonts/MapleMono-CN-Regular/result.css" />
      </head>
      {/* Umami 统计 */}
      {process.env.NEXT_PUBLIC_UMAMI_ID && process.env.NODE_ENV === 'production' ? (
        <Script src="https://um.baiwumm.com/script.js" data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID} />
      ) : null}
      <body>
        {/* Vercel 分析 */}
        <Analytics />
        <Providers>
          <NextThemesProvider attribute="class" defaultTheme={process.env.NEXT_PUBLIC_THEME || THEME_MODE.LIGHT}>
            <FullLoading />
            <Header />
            <main className="container! mx-auto min-h-[calc(100vh-9.1rem)] p-4">
              {children}
            </main>
            <Footer />
            {/* 回到顶部 */}
            <BackTop />
          </NextThemesProvider>
        </Providers>
      </body>
    </html>
  );
}
