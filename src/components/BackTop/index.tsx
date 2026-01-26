/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 14:09:32
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-26 09:57:49
 * @Description: 回到顶部
 */
'use client';

import { ArrowUp } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { type FC, useEffect, useRef, useState } from 'react';

import { ProgressCircle } from '@/components/Progress';

type BackTopProps = {
  visibilityHeight?: number; // 滚动高度达到此参数值才出现 BackTop
}

const BackTop: FC<BackTopProps> = ({ visibilityHeight = 150 }) => {
  const { scrollYProgress, scrollY } = useScroll(); // 追踪滚动
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);
  const [visible, setVisible] = useState(false); // 是否显示按钮
  const [direction, setDirection] = useState<'up' | 'down'>('down');

  const lastScrollY = useRef(0);

  // 监听滚动百分比
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollPercentage(Math.round(latest * 100));
  });

  // 方向 + 显隐
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > visibilityHeight);

    const DELTA = 4; // 防抖阈值
    if (latest - lastScrollY.current > DELTA) {
      setDirection('down');
    } else if (lastScrollY.current - latest > DELTA) {
      setDirection('up');
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

  // 页面加载时回到顶部
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed right-5 bottom-5 cursor-pointer z-80"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 20, scale: .5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: .5 }}
          transition={{ duration: 0.3 }}
        >
          <ProgressCircle
            value={scrollPercentage}
            size={40}
            strokeWidth={3}
            className="text-accent-soft"
            indicatorClassName="text-accent"
          >
            <AnimatePresence mode="wait">
              {direction === 'up' ? (
                <motion.div
                  key="arrow"
                  initial={{ opacity: 0, y: 6, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowUp size={20} className="text-accent" />
                </motion.div>
              ) : (
                <motion.div
                  key="percent"
                  initial={{ opacity: 0, y: -6, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-default-foreground"
                >
                  {scrollPercentage}
                </motion.div>
              )}
            </AnimatePresence>
          </ProgressCircle>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackTop;