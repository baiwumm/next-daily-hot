/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-19 17:52:08
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 18:14:14
 * @Description: 顶部布局
 */
'use client'
import { Button, Image, Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import { RiGithubFill } from "@remixicon/react";
import { useRafState } from 'ahooks';
import dayjs from 'dayjs';
import { Lunar } from 'lunar-typescript';
import { useEffect } from 'react';

import HotSettings from '@/components/HotSettings'
import ThemeSwitcher from '@/components/ThemeSwitcher';

import pkg from '../../../package.json'

export default function Header() {
  // 当前时间
  const [currentTime, setCurrentTime] = useRafState<string>('');

  /**
   * @description: 农历时间
   */
  const renderLunarCalendar = () => {
    // 解构农历对象
    const lunar = Lunar.fromDate(new Date());
    const gzYear = lunar.getYearInGanZhi(); // 道历年
    const gzMonth = lunar.getMonthInGanZhi(); // 道历月
    const gzDay = lunar.getDayInGanZhi(); // 道历日
    const IMonthCn = lunar.getMonthInChinese(); // 农历月
    const IDayCn = lunar.getDayInChinese(); // 农历日
    const ncWeek = lunar.getWeekInChinese(); // 农历星期
    return `${gzYear}年 ${gzMonth}月 ${gzDay}日 ${IMonthCn}月${IDayCn} 星期${ncWeek}`;
  };

  useEffect(() => {
    const tick = () => {
      // 格式化为北京时间（可替换为其他时区）
      const formatted = dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
      setCurrentTime(formatted);
    };

    tick(); // 立即显示一次
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, [setCurrentTime]);
  return (
    <Navbar isBordered classNames={{ wrapper: "!container" }}>
      <NavbarBrand>
        <div className="flex gap-2 justify-between items-center grow-0 shrink-0">
          <Image src='/logo.svg' width={40} height={40} alt="Logo" />
          <div>
            <h1 className="font-black text-lg">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
            <h3 className="text-tiny text-slate-500/75 mt-0.5 hidden sm:block">{process.env.NEXT_PUBLIC_APP_DESC}</h3>
          </div>
        </div>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <div className="flex flex-col gap-1 text-center">
          <div className="text-sm">{currentTime || '正在加载时间...'}</div>
          <span className="text-slate-500/75 text-xs">{renderLunarCalendar()}</span>
        </div>
      </NavbarContent>
      <NavbarContent justify="end">
        {/* 热榜设置 */}
        <HotSettings />
        {/* 主题切换按钮 */}
        <ThemeSwitcher />
        {/* Github */}
        <Button
          isIconOnly
          aria-label="Github"
          variant="ghost"
          radius="full"
          size="sm"
          onPress={() => window.open(`https://github.com/${pkg.author.name}/${pkg.name}`)}>
          <RiGithubFill size={18} />
        </Button>
      </NavbarContent>
    </Navbar>
  );
}
