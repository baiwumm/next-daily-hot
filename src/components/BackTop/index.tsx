/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-16 15:18:21
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-16 17:49:51
 * @Description: 回到顶部按钮
 */
'use client';

import { useState } from 'react';

import { CircularProgress, Tooltip } from '@nextui-org/react';
import { useMount } from 'ahooks';
import { useScroll, useMotionValueEvent } from 'framer-motion';

const BackTop = () => {
  // 使用useScroll钩子来追踪滚动信息
  const { scrollYProgress } = useScroll();
  // 滚动百分比
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollPercentage(Math.round(latest * 100));
  });

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // 为平滑滚动
    });
  };

  // 保持每次加载时回到顶部
  useMount(() => {
    scrollToTop();
  });
  return (
    <Tooltip showArrow content="回到顶部" placement="bottom">
      <div className="cursor-pointer" onClick={scrollToTop}>
        <CircularProgress
          aria-label="Loading..."
          size="sm"
          value={scrollPercentage}
          color="success"
          formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
          showValueLabel={true}
        />
      </div>
    </Tooltip>
  );
};
export default BackTop;
