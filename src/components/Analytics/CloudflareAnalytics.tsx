/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-20 09:57:27
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-10 09:51:02
 * @Description: Cloudflare 统计代码
 */
import Script from 'next/script';

const CloudflareAnalytics = () => {
  return process.env.CLOUDFLARE_ANALYTICS && process.env.NODE_ENV === 'production' ? (
    <Script src="https://analytics.baiwumm.com/tracker.min.js" data-website-id={process.env.CLOUDFLARE_ANALYTICS} />
  ) : null;
};
export default CloudflareAnalytics;
