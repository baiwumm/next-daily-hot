/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-27 18:02:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-28 17:30:41
 * @Description:全局设置
 */
'use client';

import { useEffect, useState } from 'react';

import { Switch, cn, Button, Card, CardHeader, CardBody, Divider, CardFooter, User } from '@nextui-org/react';
import { useLocalStorageState } from 'ahooks';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Toaster, toast } from 'sonner';

import TransitionWrapper from '@/components/TransitionWrapper';

import { LOCAL_KEY } from '@/utils/enum';
import type { HotTypes, HotListConfig } from '@/utils/types';

import { hotCardConfig } from '@/utils';

type UseThemeProps = {
  theme?: 'light' | 'dark' | 'system';
};

const GlobalSetting = () => {
  const router = useRouter();
  // 主题
  const { theme } = useTheme() as UseThemeProps;
  // 判断组件是否挂载
  const [mounted, setMounted] = useState(false);
  // 不显示的榜单列表
  const [hiddenHotList, setHiddenHotList] = useLocalStorageState<HotTypes[]>(LOCAL_KEY.HOTHIDDEN, {
    defaultValue: [],
  });

  // Switch 回调
  const onChangeHotShow = (isSelected: boolean, config: HotListConfig) => {
    const { value, label, tip } = config;
    const result = isSelected ? hiddenHotList?.filter((item) => item !== value) : [...(hiddenHotList || []), value];
    setHiddenHotList(result);
    toast.success(`${isSelected ? '开启' : '关闭'}${label}${tip}成功`);
  };

  // 全部打开回调
  const onChangeOpenAll = () => {
    setHiddenHotList(undefined);
    toast.success(`全部开启榜单成功`);
  };

  // 全部关闭回调
  const onChangeCloseAll = () => {
    setHiddenHotList(hotCardConfig.map((item) => item.value));
    toast.success(`全部关闭榜单成功`);
  };

  // 返回首页回调
  const onClickBack = () => {
    if (hiddenHotList?.length === hotCardConfig.length) {
      toast.warning(`至少要开启一个榜单哟 🤓`);
      return;
    }
    router.push('/');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // 判断组件是否挂载
  if (!mounted) {
    return null;
  }
  return (
    <div className="px-12 lg:px-20 py-5">
      <Card>
        <CardHeader>
          <h4 className="font-bold text-large">热榜显示设置</h4>
        </CardHeader>
        <Divider />
        <CardBody>
          <TransitionWrapper>
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(20rem,1fr))' }}>
              {hotCardConfig.map((config) => {
                const { value, label, tip } = config;
                return (
                  <Switch
                    key={value}
                    isSelected={!hiddenHotList || !hiddenHotList?.includes(value)}
                    classNames={{
                      base: cn(
                        'inline-flex flex-row-reverse w-full bg-content1 hover:bg-content2 items-center',
                        'justify-between cursor-pointer rounded-lg gap-2 p-5 border-2',
                        'data-[selected=true]:border-primary max-w-full',
                      ),
                      wrapper: 'p-0 h-4 overflow-visible',
                      thumb: cn(
                        'w-6 h-6 border-2 shadow-lg',
                        'group-data-[hover=true]:border-primary',
                        //selected
                        'group-data-[selected=true]:ml-6',
                        // pressed
                        'group-data-[pressed=true]:w-7',
                        'group-data-[selected]:group-data-[pressed]:ml-4',
                      ),
                    }}
                    onValueChange={(isSelected) => onChangeHotShow(isSelected, config)}
                  >
                    <User
                      name={label}
                      description={tip}
                      avatarProps={{
                        src: `/${value}.svg`,
                        radius: 'sm',
                        classNames: {
                          base: 'bg-transparent',
                        },
                      }}
                    />
                  </Switch>
                );
              })}
            </div>
          </TransitionWrapper>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="flex justify-center items-center w-full gap-4">
            <Button color="success" variant="flat" size="md" onClick={onChangeOpenAll}>
              全部打开
            </Button>
            <Button color="danger" variant="flat" size="md" onClick={onChangeCloseAll}>
              全部关闭
            </Button>
            <Button color="primary" variant="flat" size="md" onClick={onClickBack}>
              返回首页
            </Button>
          </div>
        </CardFooter>
      </Card>
      {/* toast 提示 */}
      <Toaster richColors position="top-center" theme={theme} />
    </div>
  );
};
export default GlobalSetting;
