/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-20 10:16:06
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-20 10:17:36
 * @Description: 谷歌统计代码
 */
import { GoogleAnalytics } from '@next/third-parties/google';

const GoogleUtilities = () => {
  return process.env.GOOGLE_ANALYTICS && process.env.NODE_ENV === 'production' ? (
    <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS} />
  ) : null;
};
export default GoogleUtilities;
