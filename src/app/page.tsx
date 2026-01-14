/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-19 15:55:09
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-14 11:26:27
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
  const hiddenItems = useAppStore(state => state.hiddenItems);

  const visibleItems = useMemo(() => {
    const hiddenSet = new Set(hiddenItems ?? []);
    return HOT_ITEMS.items.filter(({ value }) => !hiddenSet.has(value));
  }, [hiddenItems]);

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
            initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <HotCard {...raw} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
