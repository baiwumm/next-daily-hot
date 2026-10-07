/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-04 17:56:06
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-14 14:30:51
 * @Description: 全局状态
 */

'use client'
import type { HotValue } from '@/enums'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { HOT_ITEMS } from '@/enums'
import { fromNow } from '@/lib/utils'

/** 排名趋势快照：某平台上次抓取时的条目排名 */
interface RankSnapshot {
  /** 数据指纹（标题序列），同一份数据重复触发时幂等跳过 */
  hash: string
  /** 标题（trim 后）→ 排名 */
  ranks: Record<string, number>
}

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

  /** 排名趋势快照（持久化）：上次抓取时各平台条目的标题 → 排名，作为趋势对比基准 */
  rankSnapshots: Partial<Record<HotValue, RankSnapshot>>
  /** 排名趋势（瞬态派生，不持久化）：平台 → 标题 → 名次变化（正数上升 / 负数下降 / 0 持平）；null 表示尚无对比基准 */
  rankTrends: Partial<Record<HotValue, Record<string, number> | null>>
  /** 记录一次抓取排名并派生趋势：与上次数据指纹相同则幂等跳过（StrictMode 双跑 / 缓存命中均安全） */
  recordRankSnapshot: (value: HotValue, hash: string, ranks: Record<string, number>) => void

  /** 搜索跳转信号（瞬态）：index 为 -1 表示只定位到卡片；token 递增以支持重复跳转同一目标 */
  searchJump: { value: HotValue; index: number; token: number } | null
  setSearchJump: (jump: AppState['searchJump']) => void
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

      /* ================= 排名趋势 ================= */
      rankSnapshots: {},
      rankTrends: {},
      recordRankSnapshot: (value, hash, ranks) => {
        const current = get().rankSnapshots[value]

        // 同一份数据不重算：既省一次全量对比，也保证 effect 重跑时趋势显示稳定
        if (current?.hash === hash) return

        // 派生趋势：只对比两次快照都存在的条目；新条目由组件按「不在对比结果中」识别
        const deltas: Record<string, number> = {}

        if (current) {
          for (const [title, rank] of Object.entries(ranks)) {
            const prevRank = current.ranks[title]

            if (prevRank !== undefined) deltas[title] = prevRank - rank
          }
        }

        set((state) => ({
          rankSnapshots: { ...state.rankSnapshots, [value]: { hash, ranks } },
          rankTrends: { ...state.rankTrends, [value]: current ? deltas : null },
        }))
      },

      /* ================= 搜索跳转 ================= */
      searchJump: null,
      setSearchJump: (jump) => {
        set({ searchJump: jump })
      },
    }),
    {
      name: 'app-store', // 用于存储在 localStorage 中的键名
      version: 2, // Vercel 最佳实践：数据结构版本化，字段变更时递增并配合 migrate 平滑迁移
      storage: createJSONStorage(() => localStorage), // 指定使用 localStorage 存储
      migrate: (persistedState) => {
        // 兼容旧数据 / 版本升级：缺失字段回退到默认值
        // 返回类型断言为 AppState：persist 默认 merge 会与初始 state 浅合并补全方法
        const state = (persistedState ?? {}) as Partial<AppState>

        return {
          UpdateTime: state.UpdateTime ?? {},
          hiddenItems: state.hiddenItems ?? [],
          sortItems: state.sortItems ?? HOT_ITEMS.values,
          rankSnapshots: state.rankSnapshots ?? {},
        } as AppState
      },
      // ⚠️ now / rankTrends 是纯派生用的，不需要持久化
      partialize: (state) =>
        ({
          UpdateTime: state.UpdateTime,
          hiddenItems: state.hiddenItems,
          sortItems: state.sortItems,
          rankSnapshots: state.rankSnapshots,
        }) as any,
    },
  ),
)
