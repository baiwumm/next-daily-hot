/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 14:09:32
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-07 16:24:23
 * @Description: 回到顶部
 */
'use client';
import { ArrowUp } from '@gravity-ui/icons';
import { ProgressCircle } from '@heroui/react';
import NumberFlow from '@number-flow/react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { type FC, useRef, useState } from 'react';

const MotionProgressCircle = motion.create(ProgressCircle);
const MotionArrowUp = motion.create(ArrowUp);
const MotionNumberFlow = motion.create(NumberFlow);

type BackTopProps = {
  visibilityHeight?: number; // 滚动高度达到此参数值才出现 BackTop
};

const BackTop: FC<BackTopProps> = ({ visibilityHeight = 150 }) => {
  const { scrollYProgress, scrollY } = useScroll();

  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [visible, setVisible] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('down');

  const lastScrollY = useRef(0);
  const lastUpdate = useRef(0);

  // 滚动百分比
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const next = Math.round(latest * 100);

    setScrollPercentage((prev) => (prev === next ? prev : next));
  });

  // 滚动方向 + 显隐（throttle）
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const now = Date.now();

    // 降低更新频率
    if (now - lastUpdate.current < 80) return;

    lastUpdate.current = now;

    setVisible((prev) => {
      const next = latest > visibilityHeight;
      return prev === next ? prev : next;
    });

    const DELTA = 4;

    if (latest - lastScrollY.current > DELTA) {
      setDirection((prev) => (prev === 'down' ? prev : 'down'));
    } else if (lastScrollY.current - latest > DELTA) {
      setDirection((prev) => (prev === 'up' ? prev : 'up'));
    }

    lastScrollY.current = latest;
  });

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <MotionProgressCircle
          aria-label="回到顶部"
          value={scrollPercentage}
          color="accent"
          size="lg"
          className="fixed right-5 bottom-5 z-50 cursor-pointer"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 20, scale: 0.6 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.6 }}
          transition={{ duration: 0.25 }}
        >
          {/* 中间内容 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {direction === 'up' ? (
                <MotionArrowUp
                  key="arrow"
                  initial={{ opacity: 0, y: 6, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="text-accent"
                />
              ) : (
                <MotionNumberFlow
                  key="percent"
                  initial={{ opacity: 0, y: -6, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  value={scrollPercentage}
                  className="text-xs text-muted"
                />
              )}
            </AnimatePresence>
          </div>

          {/* 圆环 */}
          <ProgressCircle.Track>
            <ProgressCircle.TrackCircle strokeWidth={3} />
            <ProgressCircle.FillCircle strokeWidth={3} />
          </ProgressCircle.Track>
        </MotionProgressCircle>
      )}
    </AnimatePresence>
  );
};

export default BackTop;