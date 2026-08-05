/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-19 15:55:09
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:51:09
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
import { HOT_ITEMS } from '@/enums'
import pkg from '#/package.json'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} - ${process.env.NEXT_PUBLIC_APP_DESC}`, // 网站标题
  description: process.env.NEXT_PUBLIC_APP_DESC, // 网站描述
  applicationName: process.env.NEXT_PUBLIC_APP_NAME, // 应用名称
  authors: [
    {
      name: pkg.author.name,
      url: pkg.author.url,
    },
  ],
  verification: {
    other: { 'baidu-site-verification': 'codeva-kYzuuOyYCZ', 'bytedance-verification-code': 'oPgCIrgBz/3Lhr9BoNE2' },
  }, // 网站验证
  keywords: HOT_ITEMS.items.map(({ raw }) => `${raw.label}${raw.tip}`), // 网站关键词
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESC,
    siteName: process.env.NEXT_PUBLIC_APP_NAME,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og.png`,
        width: 1200,
        height: 630,
      },
    ],
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
    <html lang="zh-CN" suppressHydrationWarning>
      {/* 引入字体文件 */}
      <head>
        <meta name="version" content={pkg.version} />
        <link href="https://cdn.baiwumm.com" rel="preconnect" />
        <link href="https://cdn.baiwumm.com/fonts/MapleMono-CN-Regular/result.css" rel="stylesheet" />
      </head>
      <body className="bg-background text-foreground flex flex-col gap-4 min-h-screen">
        <NextThemesProvider attribute="class" disableTransitionOnChange>
          <FullLoading />
          <Header />
          <main className="flex-1 min-h-0 container! mx-auto px-4">
            {children}
          </main>
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
