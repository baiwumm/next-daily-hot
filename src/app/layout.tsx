/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-08 17:12:20
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-15 17:48:37
 * @Description: 默认布局
 */
import { GoogleAnalytics } from '@next/third-parties/google';
import { NextUIProvider } from '@nextui-org/react';
import { Inter } from 'next/font/google';
import Script from 'next/script';
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
  verification: {
    other: { 'baidu-site-verification': 'codeva-kYzuuOyYCZ', 'bytedance-verification-code': 'oPgCIrgBz/3Lhr9BoNE2' },
  }, // 网站验证
  keywords: process.env.SITE_KEYWORDS, // 网站关键词
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 百度统计 */}
      <Script
        id="baidu-analytics"
        dangerouslySetInnerHTML={{
          __html: `var _hmt=_hmt||[];!function(){var e=document.createElement("script");e.src="https://hm.baidu.com/hm.js?029f8002fa463259746b84add5678d56";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}();`,
        }}
      />
      {/* 微软分析 Clarity 代码 */}
      <Script
        id="clarity-analytics"
        dangerouslySetInnerHTML={{
          __html: `!function(t,e,n,c,s,a,r){t[n]=t[n]||function(){(t[n].q=t[n].q||[]).push(arguments)},(a=e.createElement(c)).async=1,a.src="https://www.clarity.ms/tag/jm0kos9fw7",(r=e.getElementsByTagName(c)[0]).parentNode.insertBefore(a,r)}(window,document,"clarity","script");`,
        }}
      />
      {/* 谷歌统计 */}
      <GoogleAnalytics gaId="G-ELGSN8JG3R" />
      <Script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","G-ELGSN8JG3R");`,
        }}
      />
      {/* umami - 站点统计分析 */}
      <Script src="https://umami.baiwumm.com/script.js" data-website-id="11ab3a77-4c46-4587-ad1d-03b61fb26730" />
      <body className={inter.className}>
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
