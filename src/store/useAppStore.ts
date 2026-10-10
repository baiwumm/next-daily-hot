/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-04 17:56:06
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-14 14:30:51
 * @Description: 全局状态
 */

'use client'
import type { HotCategory, HotValue } from '@/config/hot-list'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { HOT_CATEGORY_LIST, HOT_ITEMS } from '@/config/hot-list'
import { fromNow } from '@/lib/utils'

/** 排名趋势快照：某平台上次抓取时的条目排名 */
interface RankSnapshot {
  /** 数据指纹（标题序列），同一份数据重复触发时幂等跳过 */
  hash: string
  /** 标题（trim 后）→ 排名 */
  ranks: Record<string, number>
  /** 快照写入时间，用于基准时效判断（过老的整体轮换榜单只会产生满屏噪声标记） */
  savedAt: number
}

/** 趋势基准时效：快照超过该时长不作为对比基准（新闻榜隔夜整榜轮换，逐条标记无参考价值） */
const SNAPSHOT_MAX_AGE = 12 * 60 * 60 * 1000
/** 噪声熔断阈值：单轮「新上榜」条目占比超过一半视为整榜换血，本轮不出任何标记 */
const NEW_RATIO_THRESHOLD = 0.5

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

  // 热榜排序（扁平展示顺序：分类块连续，块内为用户拖拽顺序；派生关系见 getOrderedCategories / getCategoryValues）
  sortItems: HotValue[]
  setSortItems: (items: HotValue[]) => void

  /** 分类顺序（设置里 ↑/↓ 调整；首页分节与锚点指示器共用） */
  categoryOrder: HotCategory[]
  setCategoryOrder: (items: HotCategory[]) => void

  /** 收藏的常看平台（跨分类聚合，数组顺序即展示顺序；首页置顶分节与设置管理区块共用） */
  favoriteItems: HotValue[]
  setFavoriteItems: (items: HotValue[]) => void
  toggleFavorite: (value: HotValue) => void

  /** 排名趋势快照（持久化）：上次抓取时各平台条目的标题 → 排名，作为趋势对比基准 */
  rankSnapshots: Partial<Record<HotValue, RankSnapshot>>
  /** 排名趋势（瞬态派生，不持久化）：平台 → 标题 → 名次变化（正数上升 / 负数下降 / 0 持平）；null 表示本轮不显示标记（无基准 / 基准过期 / 新条目过半） */
  rankTrends: Partial<Record<HotValue, Record<string, number> | null>>
  /** 记录一次抓取排名并派生趋势：与上次数据指纹相同则幂等跳过（StrictMode 双跑 / 缓存命中均安全）；基准过期或新条目过半时熔断本轮标记 */
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

      /* ================= 分类顺序 ================= */
      categoryOrder: [...HOT_CATEGORY_LIST],
      setCategoryOrder: (items) => {
        set({ categoryOrder: items })
      },

      /* ================= 常看收藏 ================= */
      favoriteItems: [],
      setFavoriteItems: (items) => {
        set({ favoriteItems: items })
      },
      toggleFavorite: (value) => {
        set((state) => ({
          favoriteItems: state.favoriteItems.includes(value)
            ? state.favoriteItems.filter((item) => item !== value)
            : [...state.favoriteItems, value],
        }))
      },

      /* ================= 排名趋势 ================= */
      rankSnapshots: {},
      rankTrends: {},
      recordRankSnapshot: (value, hash, ranks) => {
        const current = get().rankSnapshots[value]

        // 同一份数据不重算：既省一次全量对比，也保证 effect 重跑时趋势显示稳定
        if (current?.hash === hash) return

        // 基准时效：快照过老（如隔夜）时整榜往往已轮换，逐条对比只剩噪声，静默重建基准
        const savedAt = current?.savedAt ?? 0
        const valid = Boolean(current) && Date.now() - savedAt < SNAPSHOT_MAX_AGE

        // 派生趋势：只对比两次快照都存在的条目；新条目由组件按「不在对比结果中」识别
        const deltas: Record<string, number> = {}
        let newCount = 0

        if (current && valid) {
          for (const [title, rank] of Object.entries(ranks)) {
            const prevRank = current.ranks[title]

            if (prevRank === undefined) {
              newCount += 1
            } else {
              deltas[title] = prevRank - rank
            }
          }
        }

        // 噪声熔断：新上榜条目过半说明整榜已换血，本轮逐条标记没有信息量
        const tooManyNew = valid && newCount / Object.keys(ranks).length > NEW_RATIO_THRESHOLD

        set((state) => ({
          rankSnapshots: { ...state.rankSnapshots, [value]: { hash, ranks, savedAt: Date.now() } },
          rankTrends: { ...state.rankTrends, [value]: valid && !tooManyNew ? deltas : null },
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
      version: 7, // Vercel 最佳实践：数据结构版本化，字段变更时递增并配合 migrate 平滑迁移
      storage: createJSONStorage(() => localStorage), // 指定使用 localStorage 存储
      migrate: (persistedState) => {
        // 兼容旧数据 / 版本升级：缺失字段回退到默认值
        // 返回类型断言为 AppState：persist 默认 merge 会与初始 state 浅合并补全方法
        const state = (persistedState ?? {}) as Partial<AppState>

        // v5 → v6：豆瓣电影的 value 更正拼写为 douban-movie，旧数据里按 value 存的键与顺序一并跟随
        const fixValue = (value: string): HotValue => (value === 'douban-movic' ? 'douban-movie' : (value as HotValue))

        const UpdateTime = Object.fromEntries(
          Object.entries(state.UpdateTime ?? {}).map(([value, ts]) => [fixValue(value), ts]),
        )

        // v4 → v5：快照补 savedAt 时间戳，旧数据记为 0（已过期）——升级后首轮静默重建基准，避免拿远古快照对比出满屏「新」
        const rankSnapshots = Object.fromEntries(
          Object.entries(state.rankSnapshots ?? {}).map(([value, snapshot]) => [
            fixValue(value),
            { ...snapshot, savedAt: snapshot?.savedAt ?? 0 },
          ]),
        )

        // v6 → v7：新增常看收藏，旧数据回退为空数组；顺手剔除配置已下线的平台并去重
        const favoriteItems = [
          ...new Set((state.favoriteItems ?? []).map(fixValue).filter((value) => HOT_ITEMS.raw(value))),
        ]

        return {
          UpdateTime,
          hiddenItems: (state.hiddenItems ?? []).map(fixValue),
          sortItems: (state.sortItems ?? HOT_ITEMS.values).map(fixValue),
          rankSnapshots,
          categoryOrder: state.categoryOrder ?? [...HOT_CATEGORY_LIST],
          favoriteItems,
        } as AppState
      },
      // ⚠️ now / rankTrends / searchJump 是纯派生用的，不需要持久化
      partialize: (state) =>
        ({
          UpdateTime: state.UpdateTime,
          hiddenItems: state.hiddenItems,
          sortItems: state.sortItems,
          rankSnapshots: state.rankSnapshots,
          categoryOrder: state.categoryOrder,
          favoriteItems: state.favoriteItems,
        }) as any,
    },
  ),
)
