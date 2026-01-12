/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 14:33:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-12 14:58:16
 * @Description: 热榜卡片
 */
'use client';
import {
  Button,
  Card,
  Chip,
  ScrollShadow,
  Separator,
  Spinner,
  Tooltip
} from '@heroui/react';
import { useInterval, useRequest } from 'ahooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { CircleX, RefreshCw } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

import 'dayjs/locale/zh-cn';
import BlurFade from '@/components/BlurFade';
import OverflowDetector from '@/components/OverflowDetector';
import { RESPONSE, THEME_MODE } from '@/enums';
import { CircleCheckIcon } from '@/lib/icons';
import { formatNumber, hotLableColor, hotTagColor } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

dayjs.extend(utc);
dayjs.extend(timezone);
// 引入处理相对时间的插件
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const HotCard = ({ value, label, tip, prefix, suffix }: App.HotListConfig) => {
  const UpdateTime = useAppStore(state => state.UpdateTime);
  const setUpdateTime = useAppStore(state => state.setUpdateTime);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  const { theme } = useTheme();
  const isLight = theme === THEME_MODE.LIGHT;

  const [relativeTime, setRelativeTime] = useState<string>('');

  const renderHot = (value: string | number) => (
    <div className="shrink-0 text-xs text-black/45 dark:text-white">
      {value}
    </div>
  );

  const { data, loading, run } = useRequest(
    async () => {
      const response = await fetch(`/api/${value}`);
      if (response.status !== RESPONSE.SUCCESS) {
        throw new Error('Request failed');
      }
      const result: App.IResponse = await response.json();
      if (result.code === RESPONSE.ERROR) {
        throw new Error('API returned error');
      }
      setUpdateTime({ [value]: dayjs().valueOf() }); // ✅ 成功后更新时间
      return result.data || [];
    },
    {
      manual: true,
      debounceWait: 300,
      retryCount: 3,
    }
  );

  // 渲染热度
  const renderEndContent = (hot: number | string, tip: string | undefined) => hot
    ? renderHot(formatNumber(hot))
    : tip
      ? renderHot(`${prefix || ''}${tip}${suffix || ''}`)
      : null

  // ✅ 使用 ready 控制自动加载（更可靠）
  useEffect(() => {
    if (isInView && !data?.length) {
      run();
    }
  }, [isInView, run, data]);

  // ✅ 自动清理的 interval（ahooks 内部已处理）
  useInterval(() => {
    const lastUpdate = UpdateTime?.[value];
    const text = lastUpdate ? dayjs(lastUpdate).fromNow() : '刚刚';
    setRelativeTime(text);
  }, 1000);

  return (
    <Card className="rounded-lg p-0 gap-0 shadow-md border border-default" ref={ref}>
      <Card.Header className="flex justify-between items-center flex-row p-3">
        <div className="flex items-center gap-2">
          <Image
            src={`/${value}.svg`}
            alt={`${label}${tip}`}
            width={24}
            height={24}
          />
          <div className="font-bold text-sm">{label}</div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <Chip color={data?.length ? 'success' : 'danger'} variant="soft" size="sm" className="px-2 py-0.5">
            {data?.length ? (
              <CircleCheckIcon size={12} />
            ) : (
              <CircleX size={12} />
            )}
            {tip}
          </Chip>
        </motion.div>
      </Card.Header>
      <Separator />
      <Card.Content className="relative pl-3 py-0">
        {loading ? (
          <div className="absolute inset-0 w-full h-full flex justify-center items-center card--default/75 z-10">
            <Spinner color="current" />
          </div>
        ) : null}
        <ScrollShadow className="h-[315px] overflow-x-hidden pr-1">
          {loading ? null : !data?.length ? (
            <div className="flex h-full justify-center items-center text-xs text-slate-500/75 px-8 text-center leading-5">
              抱歉，可能服务器遇到问题了，请稍后重试，或者打开右上角设置关闭热榜显示！🤔
            </div>
          ) : (
            <BlurFade>
              {(data || []).map((item, index) => {
                const { label } = item;
                return (
                  <div key={item.url} className="flex group justify-between items-center gap-1 min-w-0 border-b border-default py-1.5 w-full last:border-none">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div
                        className="text-xs w-6 h-6 rounded shrink-0 flex items-center justify-center"
                        style={{
                          backgroundColor: label
                            ? hotLableColor[label]
                            : hotTagColor[index] || (!isLight ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0,0,0,.04)'),
                          color: isLight && (label ? hotLableColor[label] : hotTagColor[index]) ? '#ffffff' : 'inherit',
                        }}
                      >
                        {label || index + 1}
                      </div>
                      <OverflowDetector record={item} type={value}>
                        {item.title}
                      </OverflowDetector>
                    </div>
                    {renderEndContent(item.hot, item.tip)}
                  </div>
                )
              })}
            </BlurFade>
          )}
        </ScrollShadow>
      </Card.Content>
      <Separator />
      <Card.Footer className="p-3">
        <div className="flex text-center justify-between w-full items-center space-x-4 text-small h-5">
          <div className="w-1/2 text-xs text-muted">
            {relativeTime ? `${relativeTime}更新` : '正在加载中...'}
          </div>
          <Separator orientation="vertical" className="flex-none" />
          <div className="flex w-1/2 justify-center">
            <Tooltip>
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                isDisabled={loading}
                onPress={run}
                className='text-muted'
              >
                <RefreshCw className={loading ? 'animate-spin' : ''} />
              </Button>
              <Tooltip.Content showArrow placement="bottom">
                <Tooltip.Arrow />
                获取最新
              </Tooltip.Content>
            </Tooltip>
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default HotCard;