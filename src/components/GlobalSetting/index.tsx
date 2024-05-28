/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-27 18:09:13
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-27 18:16:17
 * @Description:全局设置按钮
 */
'use client';

import { Tooltip } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { RiSettings3Line } from 'react-icons/ri';

const GlobalSetting = () => {
  const router = useRouter();
  return (
    <Tooltip showArrow content="全局设置" placement="top">
      <div className="btn-icon" onClick={() => router.push('/global-setting')}>
        <RiSettings3Line size={20} />
      </div>
    </Tooltip>
  );
};
export default GlobalSetting;
