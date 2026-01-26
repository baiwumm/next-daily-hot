/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-19 17:52:08
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-26 09:25:29
 * @Description: 顶部布局
 */
'use client'
import { Button } from "@heroui/react";
import Image from 'next/image';

import HotSettings from '@/components/HotSettings'
import ThemeSwitcher from '@/components/ThemeSwitcher';
import TimeAndLunar from '@/components/TimeAndLunar';
import { GithubIcon } from '@/lib/icons';
import pkg from '#/package.json'

export default function Header() {
  return (
    <div className="sticky top-0 border-b border-default h-15 z-20 backdrop-blur-sm card--default/75" id="header">
      <div className="container mx-auto h-full grid grid-cols-3 items-center px-4">
        <div className="flex gap-2 justify-self-start">
          <Image src='/logo.svg' width={36} height={36} alt="Logo" />
          <div>
            <h1 className="font-black text-base">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
            <h3 className="text-xs text-muted mt-0.5 hidden sm:block">{process.env.NEXT_PUBLIC_APP_DESC}</h3>
          </div>
        </div>
        <TimeAndLunar />
        <div className="flex gap-1 justify-self-end">
          {/* 热榜设置 */}
          <HotSettings />
          {/* 主题切换按钮 */}
          <ThemeSwitcher />
          {/* Github */}
          <Button
            isIconOnly
            aria-label="Github"
            variant="ghost"
            size="sm"
            className="rounded-full"
            onPress={() => window.open(`https://github.com/${pkg.author.name}/${pkg.name}`)}>
            <GithubIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
