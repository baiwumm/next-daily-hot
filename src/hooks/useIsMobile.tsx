/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-13 17:31:18
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-13 17:34:18
 * @Description: 判断是否是移动端
 */
import { useEffect, useState } from 'react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);
  }, []);

  return isMobile;
};

export default useIsMobile;
