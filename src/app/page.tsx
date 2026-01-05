/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-19 15:55:09
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-05 09:57:52
 * @Description: 首页
 */
'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';

import HotCard from '@/components/HotCard';
import { HOT_ITEMS } from '@/enums';
import { useAppStore } from '@/store/useAppStore';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const showItems = useAppStore(state => state.showItems);

  const visibleItems = useMemo(() => {
    const hiddenSet = new Set(showItems || []);
    return HOT_ITEMS.items.filter(({ value }) => hiddenSet.has(value));
  }, [showItems]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null
  }

  return (
    // 👇 父容器必须是 motion.div 并开启 layout
    <motion.div
      className="grid gap-4"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))' }}
      layout // ✅ 启用布局动画
    >
      <AnimatePresence>
        {visibleItems.map(({ raw }) => (
          // 👇 每个子项也必须是 motion.div + layout
          <motion.div
            key={raw.value}
            layout // ✅ 关键：让位置变化可动画
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.25 } }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <HotCard {...raw} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
