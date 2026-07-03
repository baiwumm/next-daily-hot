/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-05 09:13:12
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-03 17:24:59
 * @Description: 日期时间
 */
import { Description } from "@heroui/react";
import NumberFlow, { NumberFlowGroup } from '@number-flow/react'
import dayjs from 'dayjs';
import { Lunar } from 'lunar-typescript';
import { type FC, memo, useEffect, useState } from 'react';

const TimeAndLunar: FC = memo(function TimeAndLunar() {
  const [now, setNow] = useState(new Date());
  const [lunar, setLunar] = useState("");

  useEffect(() => {
    let lastDate = "";
    let frameId: number;

    const tick = () => {
      const current = new Date();
      setNow(current);

      const dateStr = dayjs(current).format("YYYY-MM-DD");
      if (dateStr !== lastDate) {
        lastDate = dateStr;

        const l = Lunar.fromDate(current);
        setLunar(
          `${l.getYearInGanZhi()}年 ${l.getMonthInGanZhi()}月 ${l.getDayInGanZhi()}日 ${l.getMonthInChinese()}月${l.getDayInChinese()} 星期${l.getWeekInChinese()}`
        );
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const d = now;

  return (
    <div className="justify-self-center hidden sm:flex flex-col gap-1 text-center">
      {/* 数字流时间 */}
      <NumberFlowGroup>
        <div className="flex items-center justify-center text-sm">
          <NumberFlow value={d.getFullYear()} format={{ useGrouping: false }} />
          <NumberFlow value={d.getMonth() + 1} format={{ minimumIntegerDigits: 2 }} prefix="-" />
          <NumberFlow value={d.getDate()} format={{ minimumIntegerDigits: 2 }} prefix="-" />
          <span className="mx-1"> </span>
          <NumberFlow value={d.getHours()} format={{ minimumIntegerDigits: 2 }} />
          <NumberFlow value={d.getMinutes()} format={{ minimumIntegerDigits: 2 }} prefix=":" />
          <NumberFlow value={d.getSeconds()} format={{ minimumIntegerDigits: 2 }} prefix=":" />
        </div>
      </NumberFlowGroup>
      {/* 农历 */}
      <Description>{lunar || "加载农历中..."}</Description>
    </div>
  );
});

export default TimeAndLunar;