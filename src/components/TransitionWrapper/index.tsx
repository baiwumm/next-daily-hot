/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-16 11:21:37
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-16 14:05:57
 * @Description: 过渡动画
 */
'use client';

import { motion } from 'framer-motion';

type TransitionWrapperProps = {
  children: React.ReactNode;
  delay?: number; // 延迟时间
};

export default function TransitionWrapper({ children, delay = 0 }: TransitionWrapperProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.75, delay }}
    >
      {children}
    </motion.div>
  );
}
