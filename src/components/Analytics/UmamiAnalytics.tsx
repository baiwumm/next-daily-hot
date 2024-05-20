/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-20 09:57:27
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-20 10:02:31
 * @Description: Umami 统计代码
 */
import Script from 'next/script';

const UmamiAnalytics = () => {
  return process.env.UMAMI_ANALYTICS && process.env.NODE_ENV === 'production' ? (
    <Script src="https://umami.baiwumm.com/script.js" data-website-id={process.env.UMAMI_ANALYTICS} />
  ) : null;
};
export default UmamiAnalytics;
