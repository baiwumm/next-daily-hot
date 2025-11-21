/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 14:09:32
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 18:18:33
 * @Description: 回到顶部
 */
'use client';

import { CircularProgress } from '@heroui/react';
import { useMount } from 'ahooks';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { type FC, useState } from 'react';

type BackTopProps = {
  visibilityHeight?: number; // 滚动高度达到此参数值才出现 BackTop
}

const BackTop: FC<BackTopProps> = ({ visibilityHeight = 150 }) => {
  const { scrollYProgress, scrollY } = useScroll(); // 追踪滚动
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);
  const [visible, setVisible] = useState(false); // 是否显示按钮

  // 监听滚动百分比
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollPercentage(Math.round(latest * 100));
  });

  // 监听滚动距离，滚动超过 visibilityHeight 显示按钮
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > visibilityHeight);
  });

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // 页面加载时回到顶部
  useMount(() => {
    scrollToTop();
  });

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
          <CircularProgress
            aria-label="BackTop"
            size="lg"
            value={scrollPercentage}
            color="primary"
            formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
            showValueLabel={true}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackTop;