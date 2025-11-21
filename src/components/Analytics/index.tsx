/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-21 09:16:01
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-21 09:23:19
 * @Description: 统计代码
 */
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

/**
 * @description: Umami 统计
 */
export const UmamiAnalytics = () => {
  return process.env.NEXT_PUBLIC_UMAMI_ID && process.env.NODE_ENV === 'production' ? (
    <Script src="https://um.baiwumm.com/script.js" data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID} />
  ) : null
}

/**
 * @description: 百度统计
 */
export const BaiDuAnalytics = () => {
  return process.env.NEXT_PUBLIC_BAIDU_ID && process.env.NODE_ENV === 'production' ? (
    <Script
      id="baidu-analytics"
      dangerouslySetInnerHTML={{
        __html: `var _hmt=_hmt||[];!function(){var e=document.createElement("script");e.src="https://hm.baidu.com/hm.js?${process.env.NEXT_PUBLIC_BAIDU_ID}";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}();`,
      }}
    />
  ) : null;
};

/**
 * @description: 谷歌统计
 */
export const GoogleUtilities = () => {
  return process.env.NEXT_PUBLIC_GOOGLE_ID && process.env.NODE_ENV === 'production' ? (
    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ID} />
  ) : null;
};

/**
 * @description: 微软统计
 */
export const MicrosoftClarity = () => {
  return process.env.NEXT_PUBLIC_CLARITY_ID && process.env.NODE_ENV === 'production' ? (
    <Script
      id="microsoft-clarity"
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_ID}");`,
      }}
    />
  ) : null;
};