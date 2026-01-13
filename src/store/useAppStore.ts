/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-04 17:56:06
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-12 18:07:07
 * @Description: 全局状态
 */

'use client'
import dayjs from 'dayjs';
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { HOT_ITEMS } from '@/enums';

type HotKeys = typeof HOT_ITEMS.valueType;


type AppState = {
  /** 每个热榜子项的最后更新时间 */
  UpdateTime: Partial<Record<HotKeys, number>>; // 每个子项更新时间
  setUpdateTime: (time: Partial<Record<HotKeys, number>>) => void;

  /** 当前时间心跳（用于驱动相对时间刷新） */
  now: number
  tick: () => void

  /** 获取相对时间文本（派生数据） */
  getRelativeTime: (key: HotKeys) => string

  /** 显示的热榜 */
  showItems: HotKeys[];  // 显示的热榜
  setShowItems: (items: HotKeys[]) => void;
}

export const useAppStore = create(
  persist<AppState>(
    (set, get) => ({
      /* ================= 更新时间 ================= */
      UpdateTime: {},
      setUpdateTime: (time) => {
        set((state) => ({
          UpdateTime: { ...state.UpdateTime, ...time },
        }))
      },

      /* ================= 时间心跳 ================= */
      now: Date.now(),
      tick: () => {
        set({ now: Date.now() })
      },

      /* ================= 相对时间 selector ================= */
      getRelativeTime: (key) => {
        const { UpdateTime, now } = get()

        const ts = UpdateTime[key]
        if (!ts) return '刚刚'

        // now 只是为了建立依赖
        return dayjs(ts).fromNow()
      },

      /* ================= UI 状态 ================= */
      showItems: HOT_ITEMS.values,
      setShowItems: (items) => {
        set({ showItems: items })
      },
    }),
    {
      name: 'app-store', // 用于存储在 localStorage 中的键名
      storage: createJSONStorage(() => localStorage), // 指定使用 localStorage 存储
      // ⚠️ now 是纯派生用的，不需要持久化
      partialize: (state) => ({
        UpdateTime: state.UpdateTime,
        showItems: state.showItems,
      } as any),
    }))
