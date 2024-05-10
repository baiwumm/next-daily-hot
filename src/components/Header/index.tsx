/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-09 09:50:51
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-10 14:14:06
 * @Description: 头部布局
 */
import Image from 'next/image';
import { RiGithubFill } from 'react-icons/ri';

import RealTime from '@/components/RealTime';
import ThemeMode from '@/components/ThemeMode';

import Logo from '../../../public/logo.svg';

export default function Header() {
  return (
    <header className="fixed w-screen flex gap-4 justify-between items-center top-0 h-16 shadow-md dark:shadow-white-500/50 backdrop-blur dark:bg-transparent transition-all py-3 px-4 md:px-12 lg:px-20 header-white-shadow">
      {/* 左侧 Logo 标题 */}
      <div className="flex gap-3 justify-between items-center grow-0 shrink-0">
        <Image src={Logo} alt="logo" className="w-10 h-10" />
        <div>
          <h1 className="font-black text-xl">{process.env.SITE_TITLE}</h1>
          <h3 className="text-xs text-gray-400 mt-1">{process.env.SITE_DESCRIPTION}</h3>
        </div>
      </div>
      {/* 实时时间 */}
      <div className="absolute top-2/4 left-1/2 -translate-x-1/2 -translate-y-2/4 max-md:hidden">
        <RealTime />
      </div>
      {/* 右侧社交图标 */}
      <div className="flex justify-between items-center grow-0 shrink-0">
        {/* 模式切换 */}
        <ThemeMode />
        {/* Github */}
        <a
          href={`https://github.com/${process.env.GITHUB_USERNAME}/${process.env.PROJECT_NAME}`}
          target="_blank"
          className="ease-in-out p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <RiGithubFill size={24} />
        </a>
      </div>
    </header>
  );
}
