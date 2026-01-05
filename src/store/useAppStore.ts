/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-04 17:56:06
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-05 09:52:28
 * @Description: 全局状态
 */

'use client'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { HOT_ITEMS } from '@/enums';

type HotKeys = typeof HOT_ITEMS.valueType;

type AppState = {
  UpdateTime: Partial<Record<HotKeys, number>>; // 每个子项更新时间
  setUpdateTime: (time: Partial<Record<HotKeys, number>>) => void;
  showItems: string[];  // 显示的热榜
  setShowItems: (items: string[]) => void;
}

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      UpdateTime: {},
      setUpdateTime: (time) => {
        set((state) => ({
          UpdateTime: { ...state.UpdateTime, ...time }
        }))
      },
      showItems: HOT_ITEMS.values,
      setShowItems: (items) => {
        set({ showItems: items })
      }
    }),
    {
      name: 'app-store', // 用于存储在 localStorage 中的键名
      storage: createJSONStorage(() => localStorage)// 指定使用 localStorage 存储
    }))
