/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-19 17:52:08
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-03 14:57:47
 * @Description: 顶部布局
 */
'use client'
import { HouseFill, LogoGithub } from '@gravity-ui/icons';
import { Button, Description, Tooltip } from "@heroui/react";
import Image from 'next/image';

import HotSettings from '@/components/HotSettings'
import ThemeSwitcher from '@/components/ThemeSwitcher';
import TimeAndLunar from '@/components/TimeAndLunar';
import pkg from '#/package.json'

export default function Header() {
  return (
    <div className="sticky top-0 z-20 backdrop-blur-sm p-4 container mx-auto grid grid-cols-2 sm:grid-cols-3 items-center" id="header">
      <div className="flex gap-2 items-center justify-self-start">
        <Image src='/logo.svg' width={36} height={36} alt="Logo" />
        <div>
          <h1 className="font-black text-base">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
          <Description className="mt-0.5 hidden sm:block">{process.env.NEXT_PUBLIC_APP_DESC}</Description>
        </div>
      </div>
      <TimeAndLunar />
      <div className="flex gap-1 justify-self-end">
        {/* 热榜设置 */}
        <Tooltip>
          <Tooltip.Trigger aria-label="热榜设置">
            <HotSettings />
          </Tooltip.Trigger>
          <Tooltip.Content showArrow>
            <Tooltip.Arrow />
            热榜设置
          </Tooltip.Content>
        </Tooltip>

        {/* 主题切换按钮 */}
        <Tooltip>
          <Tooltip.Trigger aria-label="主题切换">
            <ThemeSwitcher />
          </Tooltip.Trigger>
          <Tooltip.Content showArrow>
            <Tooltip.Arrow />
            主题切换
          </Tooltip.Content>
        </Tooltip>
        {/* Github */}
        <Tooltip>
          <Button
            isIconOnly
            aria-label="Github"
            variant="ghost"
            size="sm"
            className="rounded-full"
            onPress={() => window.open(`https://github.com/${pkg.author.name}/${pkg.name}`)}>
            <LogoGithub />
          </Button>
          <Tooltip.Content showArrow>
            <Tooltip.Arrow />
            Github
          </Tooltip.Content>
        </Tooltip>
        {/* 主页 */}
        <Tooltip>
          <Button
            isIconOnly
            aria-label="个人主页"
            variant="ghost"
            size="sm"
            className="rounded-full"
            onPress={() => window.open(pkg.author.url)}>
            <HouseFill />
          </Button>
          <Tooltip.Content showArrow>
            <Tooltip.Arrow />
            个人主页
          </Tooltip.Content>
        </Tooltip>

      </div>
    </div>
  );
}
