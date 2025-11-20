/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 14:40:51
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 14:45:18
 * @Description: 判断是否移动端
 */
import { useResponsive } from 'ahooks';

export const useIsMobile = () => {
  const responsive = useResponsive();
  return responsive.xs;
};