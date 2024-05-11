/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-09 17:52:44
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-11 10:34:21
 * @Description: 主题模式切换
 */
'use client';
import { useState, useEffect } from 'react';

import { Tooltip } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import { RiSunLine, RiMoonClearLine } from 'react-icons/ri';

import { THEME_MODE } from '@/utils/enum';

const ThemeMode = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // 判断是否是浅色主题
  const isLight = theme === THEME_MODE.LIGHT;

  useEffect(() => {
    setMounted(true);
  }, []);

  // 判断组件是否挂载
  if (!mounted) {
    return null;
  }
  return (
    <Tooltip showArrow content={isLight ? '浅色模式' : '深色模式'} placement="bottom">
      <div
        onClick={() => setTheme(isLight ? 'dark' : 'light')}
        className="cursor-pointer ease-in-out p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        {isLight ? <RiSunLine size={20} /> : <RiMoonClearLine size={20} />}
      </div>
    </Tooltip>
  );
};
export default ThemeMode;
