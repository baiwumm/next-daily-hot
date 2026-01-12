/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-05 09:13:12
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-12 14:49:43
 * @Description: 日期时间
 */
import dayjs from 'dayjs';
import { Lunar } from 'lunar-typescript';
import { type FC, memo, useEffect, useState } from 'react';

const TimeAndLunar: FC = memo(function TimeAndLunar() {
  const [time, setTime] = useState('');
  const [lunar, setLunar] = useState('');

  useEffect(() => {
    let lastDate = '';
    let frameId: number;

    const tick = () => {
      const now = new Date();
      const timeStr = dayjs(now).format('YYYY-MM-DD HH:mm:ss');
      setTime(timeStr);

      const dateStr = dayjs(now).format('YYYY-MM-DD');
      if (dateStr !== lastDate) {
        lastDate = dateStr;
        const l = Lunar.fromDate(now);
        const text = `${l.getYearInGanZhi()}年 ${l.getMonthInGanZhi()}月 ${l.getDayInGanZhi()}日 ${l.getMonthInChinese()}月${l.getDayInChinese()} 星期${l.getWeekInChinese()}`;
        setLunar(text);
      }

      // 使用 requestAnimationFrame 代替 setInterval，更流畅
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="justify-self-center hidden sm:flex flex-col gap-1 text-center">
      <div className="text-sm">{time || '正在加载时间...'}</div>
      <span className="text-muted text-xs">{lunar}</span>
    </div>
  );
});

export default TimeAndLunar;