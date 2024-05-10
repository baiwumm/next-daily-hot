/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-09 17:52:44
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-10 14:09:33
 * @Description: 主题模式切换
 */
'use client';
import { useState, useEffect } from 'react';

import { useTheme } from 'next-themes';
import { RiSunLine, RiMoonClearLine } from 'react-icons/ri';

const ThemeMode = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
      }}
      className="cursor-pointer ease-in-out p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      {theme === 'light' ? <RiSunLine size={20} /> : <RiMoonClearLine size={20} />}
    </div>
  );
};
export default ThemeMode;
