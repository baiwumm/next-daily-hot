/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-09 09:50:51
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-15 14:11:02
 * @Description: 头部布局
 */
import { Tooltip } from '@nextui-org/react';
import Image from 'next/image';
import { RiGithubFill } from 'react-icons/ri';

import RealTime from '@/components/RealTime';
import ThemeMode from '@/components/ThemeMode';

export default function Header() {
  return (
    <header className="sticky w-full flex gap-4 justify-between items-center top-0 h-16 shadow-md dark:shadow-[rgba(255,255,255,.15)] backdrop-blur dark:bg-transparent transition-all py-3 px-4 md:px-12 lg:px-20 z-50">
      {/* 左侧 Logo 标题 */}
      <div className="flex gap-3 justify-between items-center grow-0 shrink-0">
        <Image src="/logo.svg" alt="logo" width={40} height={40} />
        <div>
          <h1 className="font-black text-xl">{process.env.SITE_TITLE}</h1>
          <h3 className="text-xs text-mode mt-1">{process.env.SITE_DESCRIPTION}</h3>
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
        <Tooltip showArrow content="Github" placement="bottom">
          <a
            href={`https://github.com/${process.env.GITHUB_USERNAME}/${process.env.PROJECT_NAME}`}
            target="_blank"
            className="btn-icon"
          >
            <RiGithubFill size={24} />
          </a>
        </Tooltip>
      </div>
    </header>
  );
}
