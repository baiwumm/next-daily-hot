/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-10 13:35:57
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-10 16:22:44
 * @Description: 实时时间
 */
'use client';

import { useState } from 'react';

import { useInterval, useUnmount } from 'ahooks';
import dayjs from 'dayjs';
import { Lunar } from 'lunar-typescript';

const RealTime = () => {
  // 实时时间
  const [nowTime, setNowTime] = useState<string>('');
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

  /**
   * @description: 实时时间定时器
   */
  const clearInterval = useInterval(() => {
    setNowTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
  }, 1000);

  useUnmount(() => {
    clearInterval();
  });

  return (
    <div className="text-center">
      <div className="text-sm">{nowTime || '正在加载时间...'}</div>
      {/* 农历时间 */}
      <span className="text-gray-400 mt-2 text-xs">{renderLunarCalendar()}</span>
    </div>
  );
};
export default RealTime;
