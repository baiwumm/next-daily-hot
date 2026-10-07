/*
 * @Description: 全局搜索（Ctrl/⌘+K）：跨卡片搜索平台与条目标题，纯客户端内存过滤，无新增接口
 */
'use client'
import type { HotValue } from '@/enums'
import type { HotListItem, IResponse } from '@/types'

import { Magnifier } from '@gravity-ui/icons'
import { Button, Chip, Modal, SearchField, Tooltip, Typography, useOverlayState } from '@heroui/react'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'

import { CATEGORY_GROUPS, HOT_ITEMS } from '@/enums'
import { formatNumber } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'

/** 条目索引分批拉取的并发数：与巡检脚本同经验值，避免并发突发触发上游风控 */
const INDEX_CONCURRENCY = 5
/** 条目结果条数上限 */
const MAX_ENTRY_RESULTS = 50

/** 扁平化搜索结果（键盘上下选择的序号与之对应） */
type ResultRow =
  | { type: 'platform'; value: HotValue; label: string; tip: string }
  | { type: 'entry'; value: HotValue; label: string; title: string; hot?: number | string; index: number }

function HotSearch() {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  // 搜索索引：平台 → 条目列表（会话级缓存，打开面板时分批补拉未加载的平台）
  const [index, setIndex] = useState<Partial<Record<HotValue, HotListItem[]>>>({})
  const [pendingCount, setPendingCount] = useState(0)
  const fetchedRef = useRef(new Set<HotValue>())
  const listRef = useRef<HTMLDivElement>(null)

  // 受控弹层状态：Ctrl/⌘+K 全局快捷键与 Modal 内触发按钮共用
  const overlayState = useOverlayState()

  const hiddenItems = useAppStore((state) => state.hiddenItems)
  const activeCategory = useAppStore((state) => state.activeCategory)
  const setSearchJump = useAppStore((state) => state.setSearchJump)

  // 参与搜索的平台（与首页网格同一条过滤语义：显隐 + 当前分类叠加，保证搜索结果可跳转）
  const visibleValues = useMemo(() => {
    const categoryValues =
      activeCategory === 'all'
        ? null
        : new Set(CATEGORY_GROUPS.find((group) => group.category === activeCategory)?.values)

    return HOT_ITEMS.items.filter(
      (item) => !hiddenItems.includes(item.value) && (!categoryValues || categoryValues.has(item.value)),
    )
  }, [hiddenItems, activeCategory])

  // Ctrl/⌘+K 全局唤起（浏览器默认的搜索聚焦行为一并拦截）
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        overlayState.toggle()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [overlayState])

  // 关闭面板时重置输入，下次打开回到初始态
  useEffect(() => {
    if (!overlayState.isOpen) {
      setQuery('')
      setActiveIndex(0)
    }
  }, [overlayState.isOpen])

  // 命令面板打开即聚焦输入框（用受控聚焦替代 autoFocus，规避 jsx-a11y/no-autofocus）
  useEffect(() => {
    if (overlayState.isOpen) {
      const input = document.querySelector<HTMLInputElement>('[aria-label="全局搜索"] input')

      input?.focus()
    }
  }, [overlayState.isOpen])

  // 打开面板时分批补拉未索引平台的数据；失败不缓存，下次打开重试
  useEffect(() => {
    if (!overlayState.isOpen) return

    const controller = new AbortController()
    const targets = visibleValues.filter((item) => !fetchedRef.current.has(item.value))

    setPendingCount(targets.length)

    const fetchList = async (value: HotValue) => {
      try {
        const response = await fetch(`/api/${value}`, { signal: controller.signal })
        const result: IResponse = await response.json()

        if (controller.signal.aborted) return

        // 空数据与失败响应（no-store）都不进索引
        if (result.code !== 200 || !result.data?.length) return

        fetchedRef.current.add(value)
        setIndex((prev) => ({ ...prev, [value]: result.data }))
      } catch {
        // 中断或网络失败：留待下次打开重试
      } finally {
        if (!controller.signal.aborted) setPendingCount((prev) => prev - 1)
      }
    }

    void (async () => {
      for (let i = 0; i < targets.length; i += INDEX_CONCURRENCY) {
        if (controller.signal.aborted) return
        await Promise.all(targets.slice(i, i + INDEX_CONCURRENCY).map((item) => fetchList(item.value)))
      }
    })()

    return () => controller.abort()
  }, [overlayState.isOpen])

  // 激活项滚入可视区（长列表键盘导航时保持可见）
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const rows = useMemo<ResultRow[]>(() => {
    const keyword = query.trim().toLowerCase()
    const platformRows: ResultRow[] = visibleValues
      .filter(
        (item) => !keyword || item.label.toLowerCase().includes(keyword) || item.tip.toLowerCase().includes(keyword),
      )
      .map((item) => ({ type: 'platform', value: item.value, label: item.label, tip: item.tip }))

    if (!keyword) return platformRows

    const entryRows: ResultRow[] = []

    for (const { value, label } of visibleValues) {
      const list = index[value]

      if (!list) continue

      list.forEach((item, entryIndex) => {
        if (entryRows.length < MAX_ENTRY_RESULTS && item.title.toLowerCase().includes(keyword)) {
          entryRows.push({ type: 'entry', value, label, title: item.title, hot: item.hot, index: entryIndex })
        }
      })
    }

    return [...platformRows, ...entryRows]
  }, [query, visibleValues, index])

  const activate = (row: ResultRow) => {
    // index = -1 表示只定位到卡片；条目跳转的下标与卡片自身数据同源同序
    setSearchJump({ value: row.value, index: row.type === 'entry' ? row.index : -1, token: Date.now() })
    overlayState.close()
  }

  // ↑↓ 移动激活项（Enter 提交由 SearchField 的 onSubmit 承接）
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((prev) => Math.min(prev + 1, rows.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  return (
    <Modal state={overlayState}>
      {/* Tooltip 只包裹触发按钮，不能包裹整个 Modal：Modal 的 backdrop/弹窗经 portal 渲染，
          但在 React 树中仍是 Tooltip 触发元素的后代，会导致弹窗内 hover 误触发 Tooltip */}
      <Tooltip delay={0}>
        <Tooltip.Trigger aria-label="搜索">
          <Button isIconOnly aria-label="搜索" size="sm" variant="ghost">
            <Magnifier />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content showArrow>
          <Tooltip.Arrow />
          搜索（Ctrl + K）
        </Tooltip.Content>
      </Tooltip>

      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog aria-label="全局搜索" className="sm:max-w-xl overflow-hidden">
            <Modal.Header>
              <SearchField
                aria-label="搜索平台或条目标题"
                className="w-full"
                name="hot-search"
                value={query}
                variant="secondary"
                onChange={setQuery}
                onClear={() => setActiveIndex(0)}
                onSubmit={() => {
                  const row = rows[activeIndex]

                  if (row) activate(row)
                }}
              >
                <SearchField.Group className="w-full">
                  <SearchField.SearchIcon />
                  <SearchField.Input className="w-full" placeholder="搜索平台或条目标题…" onKeyDown={handleKeyDown} />
                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>
            </Modal.Header>
            <Modal.Body className="gap-0 p-2 pt-0 overflow-hidden">
              <div ref={listRef} className="max-h-[52vh] overflow-y-auto">
                {pendingCount > 0 && (
                  <Typography className="block px-2 py-1.5" color="muted" type="body-sm">
                    正在索引平台数据（剩余 {pendingCount} 个）…
                  </Typography>
                )}
                {!rows.length ? (
                  <Typography className="block px-3 py-8 text-center" color="muted" type="body-sm">
                    没有匹配的结果
                  </Typography>
                ) : (
                  rows.map((row, i) => {
                    // 平台与条目分区：类型切换处插入分组标题
                    const showHeader = i === 0 || rows[i - 1].type !== row.type

                    return (
                      <Fragment key={row.type === 'platform' ? `p-${row.value}` : `e-${row.value}-${row.index}`}>
                        {showHeader && (
                          <Typography className="block px-2 pt-2 pb-1" color="muted" type="body-sm">
                            {row.type === 'platform' ? '平台' : '条目'}
                          </Typography>
                        )}
                        <button
                          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors${i === activeIndex ? ' bg-accent/10' : ''}`}
                          data-active={i === activeIndex}
                          type="button"
                          onClick={() => activate(row)}
                          onMouseEnter={() => setActiveIndex(i)}
                        >
                          {row.type === 'platform' ? (
                            <>
                              <Chip size="sm" variant="soft">
                                {row.tip}
                              </Chip>
                              <Typography className="font-medium" type="body-sm">
                                {row.label}
                              </Typography>
                            </>
                          ) : (
                            <>
                              <Chip className="shrink-0" size="sm" variant="soft">
                                {row.label}
                              </Chip>
                              <Typography className="flex-1 min-w-0 truncate" type="body-sm">
                                {row.title}
                              </Typography>
                              {row.hot ? (
                                <Typography className="shrink-0" color="muted" type="body-sm">
                                  {formatNumber(row.hot)}
                                </Typography>
                              ) : null}
                            </>
                          )}
                        </button>
                      </Fragment>
                    )
                  })
                )}
              </div>
            </Modal.Body>
            <Modal.Footer className="flex-wrap items-center gap-x-3 gap-y-1 justify-between">
              <Typography className="whitespace-nowrap" color="muted" type="body-sm">
                ↑↓ 选择 · Enter 跳转 · Esc 关闭
              </Typography>
              <Typography className="whitespace-nowrap" color="muted" type="body-sm">
                {activeCategory === 'all' ? '' : `「${activeCategory}」`}已索引{' '}
                {visibleValues.filter((item) => index[item.value]).length}/{visibleValues.length} 平台
              </Typography>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}

export default HotSearch
