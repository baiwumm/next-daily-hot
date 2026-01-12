"use client"

import { useEffect } from 'react';

import { useAppStore } from '@/store/useAppStore';

export default function AppTimeTicker() {
  useEffect(() => {
    const id = setInterval(() => {
      useAppStore.getState().tick()
    }, 60_000) // 1 分钟

    return () => clearInterval(id)
  }, [])

  return null
}
