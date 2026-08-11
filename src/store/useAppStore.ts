/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-04 17:56:06
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-14 14:30:51
 * @Description: 全局状态
 */

'use client'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { HOT_ITEMS } from '@/enums'
import { fromNow } from '@/lib/utils'

import type { HotValue } from '@/enums'

interface AppState {
  /** 每个热榜子项的最后更新时间 */
  UpdateTime: Partial<Record<HotValue, number>> // 每个子项更新时间
  setUpdateTime: (time: Partial<Record<HotValue, number>>) => void

  /** 当前时间心跳（用于驱动相对时间刷新） */
  now: number
  tick: () => void

  /** 获取相对时间文本（派生数据） */
  getRelativeTime: (key: HotValue) => string

  /** 隐藏的热榜 */
  hiddenItems: HotValue[]
  setHiddenItems: (items: HotValue[]) => void

  // 热榜排序
  sortItems: HotValue[]
  setSortItems: (items: HotValue[]) => void
}

export const useAppStore = create(
  persist<AppState>(
    (set, get) => ({
      /* ================= 更新时间 ================= */
      UpdateTime: {},
      setUpdateTime: (time) => {
        set(state => ({
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
        if (!ts)
          return '刚刚'

        // 用 store 的 now 作为基准，与刷新冷却倒计时保持同一时钟，保证显示自洽
        // max 钳制：store 心跳可能略旧于刚写入的 updateTime，避免误显示未来时态
        return fromNow(ts, Math.max(now, ts))
      },

      /* ================= UI 状态 ================= */
      hiddenItems: [],
      setHiddenItems: (items) => {
        set({ hiddenItems: items })
      },

      sortItems: HOT_ITEMS.values,
      setSortItems: (items) => {
        set({ sortItems: items })
      },
    }),
    {
      name: 'app-store', // 用于存储在 localStorage 中的键名
      version: 1, // Vercel 最佳实践：数据结构版本化，字段变更时递增并配合 migrate 平滑迁移
      storage: createJSONStorage(() => localStorage), // 指定使用 localStorage 存储
      migrate: (persistedState) => {
        // 兼容旧数据 / 版本升级：缺失字段回退到默认值
        // 返回类型断言为 AppState：persist 默认 merge 会与初始 state 浅合并补全方法
        const state = (persistedState ?? {}) as Partial<AppState>
        return {
          UpdateTime: state.UpdateTime ?? {},
          hiddenItems: state.hiddenItems ?? [],
          sortItems: state.sortItems ?? HOT_ITEMS.values,
        } as AppState
      },
      // ⚠️ now 是纯派生用的，不需要持久化
      partialize: state => ({
        UpdateTime: state.UpdateTime,
        hiddenItems: state.hiddenItems,
        sortItems: state.sortItems,
      } as any),
    },
  ),
)
