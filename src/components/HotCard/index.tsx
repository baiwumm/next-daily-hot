/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 14:33:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-31 17:38:56
 * @Description: 热榜卡片
 */
'use client'
import { ArrowsRotateRight, CircleCheckFill, CircleXmarkFill } from '@gravity-ui/icons'
import {
  Button,
  Card,
  Chip,
  Description,
  Label,
  ScrollShadow,
  Separator,
  Spinner,
  Tooltip,
} from '@heroui/react'
import { motion, useInView } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

import BlurFade from '@/components/BlurFade'
import SkeletonCard from '@/components/SkeletonCard'
import { API_CACHE_SECONDS, RESPONSE } from '@/enums/response'
import { useRequest } from '@/hooks/use-request'
import { useAppStore } from '@/store/useAppStore'

import HotListVirtual from './HotListVirtual'

import type { HotListConfig, IResponse } from '@/types'

function HotCard({ value, label, tip, prefix, suffix }: HotListConfig) {
  const setUpdateTime = useAppStore(state => state.setUpdateTime)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  // 更新相对时间
  const relativeText = useAppStore(state =>
    state.getRelativeTime(value),
  )

  // 上次成功更新时间 + 当前时间（分钟级心跳，用于刷新冷却判断）
  const updateTime = useAppStore(state => state.UpdateTime[value])
  const now = useAppStore(state => state.now)
  // 已过分钟数（与"x 分钟前更新"的 fromNow 同源同取整，保证显示自洽）
  const elapsedMin = updateTime ? Math.round((now - updateTime) / 60_000) : 0
  // 剩余分钟 = 缓存窗口 - 已过分钟（两者相加恒等于缓存窗口）
  const remainMin = Math.round(API_CACHE_SECONDS / 60) - elapsedMin
  // 精确冷却判断（毫秒）：冷却结束才恢复可刷新
  const cooldownMs = updateTime ? API_CACHE_SECONDS * 1000 - (now - updateTime) : 0
  const isCooldown = cooldownMs > 0

  // 手动刷新时绕过 CDN 缓存（URL 加时间戳），自动加载走缓存
  const bypassCacheRef = useRef(false)

  const { data, loading, error, run } = useRequest(
    async () => {
      const url = bypassCacheRef.current
        ? `/api/${value}?t=${Date.now()}`
        : `/api/${value}`
      // 一次性消费标记
      bypassCacheRef.current = false
      const response = await fetch(url)
      if (response.status !== RESPONSE.SUCCESS) {
        throw new Error('Request failed')
      }
      const result: IResponse = await response.json()
      if (result.code === RESPONSE.ERROR) {
        throw new Error('API returned error')
      }
      // 仅在请求成功时记录更新时间，失败时保留旧值
      setUpdateTime({ [value]: Date.now() })
      return result.data || []
    },
    {
      manual: true,
      debounceWait: 300,
      retryCount: 3,
    },
  )

  // ✅ 使用 ready 控制自动加载（更可靠）
  useEffect(() => {
    if (isInView) {
      run()
    }
  }, [isInView, run])

  // 手动刷新：绕过 CDN 缓存拿最新数据
  const handleRefresh = () => {
    bypassCacheRef.current = true
    run()
  }

  return (
    <Card ref={ref} className="p-0 gap-0">
      <Card.Header className="flex justify-between items-center flex-row p-3">
        <div className="flex items-center gap-2">
          <Image
            alt={`${label}${tip}`}
            height={24}
            src={`/images/${value}.svg`}
            width={24}
            className="rounded-md shrink-0"
          />
          <Label className="font-bold">{label}</Label>
        </div>
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          initial={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <Chip
            color={data?.length ? 'success' : 'danger'}
            size="sm"
            variant="soft"
            className="px-2 py-0.5"
          >
            {loading
              ? (
                  <Spinner size="sm" />
                )
              : data?.length
                ? (
                    <CircleCheckFill width={14} />
                  )
                : (
                    <CircleXmarkFill width={14} />
                  )}
            {tip}
          </Chip>
        </motion.div>
      </Card.Header>
      <Separator />
      <Card.Content className="relative py-0">
        <ScrollShadow hideScrollBar visibility="bottom" className="h-81.75 relative">
          {loading
            ? (
                <SkeletonCard />
              )
            : null}
          {loading
            ? null
            : !data?.length
                ? (
                    <Description className="flex h-full justify-center items-center px-8 text-center leading-5">
                      抱歉，可能服务器遇到问题了，请稍后重试，或者打开右上角设置关闭热榜显示！🤔
                    </Description>
                  )
                : (
                    <BlurFade className="h-full pl-3">
                      <HotListVirtual
                        data={data}
                        prefix={prefix}
                        suffix={suffix}
                        value={value}
                      />
                    </BlurFade>
                  )}
        </ScrollShadow>
      </Card.Content>
      <Separator />
      <Card.Footer className="p-3">
        <div className="flex text-center justify-between w-full items-center space-x-4 text-small h-5">
          <Description className="w-1/2">
            {loading
              ? '正在加载中...'
              : error
                ? '更新失败'
                : `${relativeText}更新`}
          </Description>
          <Separator orientation="vertical" className="flex-none" />
          <div className="flex w-1/2 justify-center">
            <Tooltip delay={0}>
              <Button
                size="sm"
                variant="ghost"
                isDisabled={loading}
                isIconOnly
                // 冷却时不禁用按钮（否则 hover 不触发 Tooltip），改为拦截点击 + 视觉淡化
                onPress={isCooldown ? undefined : handleRefresh}
                className={`text-muted${isCooldown ? ' opacity-50' : ''}`}
              >
                {/* Vercel 最佳实践：动画加在包装层而非 SVG 元素上 */}
                <div className={loading ? 'animate-spin' : ''}>
                  <ArrowsRotateRight />
                </div>
              </Button>
              <Tooltip.Content placement="bottom" showArrow>
                <Tooltip.Arrow />
                {isCooldown
                  ? remainMin > 0
                    ? `缓存中，约 ${remainMin} 分钟后可刷新`
                    : '缓存中，即将可刷新'
                  : '获取最新'}
              </Tooltip.Content>
            </Tooltip>
          </div>
        </div>
      </Card.Footer>
    </Card>
  )
}

export default HotCard
