/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 14:00:11
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 14:08:48
 * @Description: 404 页面
 */
'use client'
import { Button } from "@heroui/react";
import Link from 'next/link';
import { type FC } from 'react';

const NotFound: FC = () => {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex justify-center items-center">
      <div className="text-center">
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">404</h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">看来这个页面去环球旅行了，还没寄明信片回来。</p>
        <div className="flex items-center justify-center mt-10">
          <Button color="primary" href="/" as={Link}>回到首页</Button>
        </div>
      </div>
    </div>
  )
}
export default NotFound;