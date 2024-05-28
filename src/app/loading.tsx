/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-28 15:10:40
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-28 15:19:50
 * @Description: 全局 Loading
 */
import { Spinner } from '@nextui-org/react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-60">
      <Spinner label="Loading..." color="primary" />
    </div>
  );
}
