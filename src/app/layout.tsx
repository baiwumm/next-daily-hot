/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-19 15:55:09
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 16:35:12
 * @Description: 根布局文件
 */

import './globals.css'

import { Toast } from '@heroui/react'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

import { BaiDuAnalytics, GoogleUtilities, MicrosoftClarity } from '@/components/Analytics'
import AppTimeTicker from '@/components/AppTimeTicker'
import BackTop from '@/components/BackTop'
import Footer from '@/components/Footer'
import FullLoading from '@/components/FullLoading'
import Header from '@/components/Header'
import MainContent from '@/components/MainContent'
import { HOT_ITEMS } from '@/enums'
import pkg from '#/package.json'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} - ${process.env.NEXT_PUBLIC_APP_DESC}`, // 网站标题
  description: process.env.NEXT_PUBLIC_APP_DESC, // 网站描述
  applicationName: pkg.name, // 应用名称
  authors: { name: pkg.author.name, url: pkg.author.url }, // 网站作者
  verification: {
    other: { 'baidu-site-verification': 'codeva-kYzuuOyYCZ', 'bytedance-verification-code': 'oPgCIrgBz/3Lhr9BoNE2' },
  }, // 网站验证
  keywords: HOT_ITEMS.items.map(({ raw }) => `${raw.label}${raw.tip}`).join(','), // 网站关键词
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      {/* 引入字体文件 */}
      <head>
        <meta name="version" content={pkg.version} />
        <link href="https://cdn.baiwumm.com" rel="preconnect" />
        <link href="https://cdn.baiwumm.com/fonts/MapleMono-CN-Regular/result.css" rel="stylesheet" />
      </head>
      <body className="bg-background text-foreground">
        <NextThemesProvider attribute="class" disableTransitionOnChange>
          <FullLoading />
          <Header />
          <MainContent>
            {children}
          </MainContent>
          <Footer />
          {/* 回到顶部 */}
          <BackTop />
          <AppTimeTicker />
          <Toast.Provider placement="top" />
        </NextThemesProvider>
        {/* Analytics */}
        <BaiDuAnalytics />
        <GoogleUtilities />
        <MicrosoftClarity />
        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  )
}
