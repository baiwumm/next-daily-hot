/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-10 17:06:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-11 18:21:06
 * @Description: 热榜卡片
 */
'use client';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Divider,
  ScrollShadow,
  Tooltip,
  Skeleton,
} from '@nextui-org/react';
import { useRequest, useDebounceFn } from 'ahooks';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { RiCheckboxCircleFill, RiLoopRightLine } from 'react-icons/ri';

import { REQUEST_STATUS, THEME_MODE } from '@/utils/enum';
import type { HotListItem, IResponse } from '@/utils/types';

import { hotTagColor, hotLableColor } from '@/utils';

const HotCard = () => {
  const { theme } = useTheme();
  /**
   * @description: 请求榜单接口
   */
  const {
    data: HotList,
    loading,
    run,
  } = useRequest(
    async () => {
      const response = await fetch('/api/weibo');
      if (response.status === REQUEST_STATUS.SUCCESS) {
        const result: IResponse = await response.json();
        return result.data || [];
      }
      return [];
    },
    {
      manual: false,
      // 防抖等待时间, 单位为毫秒，设置后，进入防抖模式
      debounceWait: 300,
      // 错误重试次数。如果设置为 -1，则无限次重试。
      retryCount: 3,
    },
  );

  // 点击刷新按钮回调
  const { run: refresh } = useDebounceFn(
    () => {
      run();
    },
    {
      wait: 350,
    },
  );
  return (
    <>
      <Card className="w-96">
        {/* 头部 */}
        <CardHeader className="flex justify-between">
          <div className="flex items-center gap-2">
            <Image src="/weibo.svg" alt="微博热搜" width={24} height={24} />
            <div className="font-bold text-md">微博</div>
          </div>
          <Chip color="success" startContent={<RiCheckboxCircleFill size={18} />} variant="flat" size="sm">
            热搜榜
          </Chip>
        </CardHeader>
        <Divider />
        {/* 热榜列表 */}
        <CardBody className="p-0">
          <ScrollShadow className="w-full h-[280px]">
            {loading ? (
              <div className="space-y-5 p-4">
                <Skeleton className="w-3/5 h-4 rounded-lg" />
                <Skeleton className="w-3/5 h-4 rounded-lg" />
                <Skeleton className="w-full h-4 rounded-lg" />
                <Skeleton className="w-full h-4 rounded-lg" />
                <Skeleton className="w-full h-4 rounded-lg" />
                <Skeleton className="w-full h-4 rounded-lg" />
                <Skeleton className="w-full h-4 rounded-lg" />
              </div>
            ) : HotList?.length ? (
              <ul className="m-0 p-0">
                {HotList.map(({ id, title, label }: HotListItem, index) => {
                  // 判断是否是深色主题
                  const isLight = theme === THEME_MODE.LIGHT;
                  return (
                    <li key={id || index} className="px-3 py-2.5 border-b">
                      <div className="flex justify-between items-center w-full gap-2">
                        {/* 索引 */}
                        <div
                          className="text-xs py-0.5 px-2 rounded flex-initial shrink-0"
                          style={{
                            backgroundColor: label
                              ? hotLableColor[label]
                              : hotTagColor[index] || (!isLight ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0,0,0,.04)'),
                            color:
                              isLight && (label ? hotLableColor[label] : hotTagColor[index]) ? '#ffffff' : 'inherit',
                          }}
                        >
                          {label || index + 1}
                        </div>
                        {/* 标题 */}
                        <div className="transition ease-in duration-300 cursor-pointer text-sm whitespace-nowrap self-start overflow-hidden text-ellipsis flex-auto relative py-1 after:absolute after:content-[''] after:h-0.5 after:w-0 after:left-0 after:-bottom-0 after:bg-slate-200 after:transition-all after:duration-500 hover:translate-x-1 hover:after:w-full">
                          {title}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              // <Listbox
              //   aria-label="Actions"
              //   onAction={(key) => alert(key)}
              //   className="p-0 gap-0"
              //   itemClasses={{
              //     base: 'px-3 rounded-none gap-3 h-10 data-[hover=true]:bg-default-100/80 after:bottom-0 mb-0',
              //   }}
              // >
              //   {HotList.map(({ id, title }: HotListItem, index) => (
              //     <ListboxItem key={id || index} showDivider>
              //       {title}
              //     </ListboxItem>
              //   ))}
              // </Listbox>
              <div className="flex h-[300px] justify-center items-center text-sm text-slate-600 dark:text-slate-400">
                各位看官，暂无数据哟🤔
              </div>
            )}
          </ScrollShadow>
        </CardBody>
        <Divider />
        {/* 底部 */}
        <CardFooter>
          <div className="flex text-center justify-between w-full items-center space-x-4 text-small h-5">
            <div className="w-1/2 text-default-400">2024-05-10</div>
            <Divider orientation="vertical" className="flex-none" />
            <div className="flex w-1/2 justify-center">
              <Tooltip showArrow content="获取最新" placement="bottom">
                <div className="btn-icon" onClick={refresh}>
                  <RiLoopRightLine size={20} />
                </div>
              </Tooltip>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};
export default HotCard;
