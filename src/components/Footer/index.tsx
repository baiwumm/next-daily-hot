/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 09:43:44
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-03 14:09:18
 * @Description: 底部版权
 */
'use client';
import { Description, Link, Separator } from '@heroui/react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { type ReactNode } from 'react';

import { Status, StatusIndicator, StatusLabel } from '@/components/Status';
import pkg from '#/package.json';

type Social = {
  icon?: ReactNode;
  image?: string;
  url: string;
  label: string;
};

export default function Footer() {
  // 备案信息
  const IcpLinks: Social[] = [
    {
      image: '/icp.png',
      url: 'https://beian.miit.gov.cn/#/Integrated/index',
      label: process.env.NEXT_PUBLIC_ICP!,
    },
    {
      image: '/gongan.png',
      url: 'https://beian.mps.gov.cn/#/query/webSearch',
      label: process.env.NEXT_PUBLIC_GONGAN!,
    },
  ];
  return (
    <footer className="mx-auto w-full container! px-6 py-4 flex md:items-center md:justify-between gap-2 flex-col md:flex-row" id="footer">
      <div className="flex items-center justify-center gap-3 md:justify-start">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" width={20} height={20} alt="Logo" />
          <span className="text-sm font-bold">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </span>
        </div>
        <Separator className="h-4 self-center" orientation="vertical" />
        <Status variant="success">
          <StatusIndicator />
          <StatusLabel>服务状态正常</StatusLabel>
        </Status>
      </div>
      <Description className="text-center md:text-start">
        &copy; {dayjs().format('YYYY')}{' '}
        <a
          href={pkg.author.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent transition-colors"
        >
          {process.env.NEXT_PUBLIC_COPYRIGHT}
        </a>
        . All rights reserved.
      </Description>
      <div className="flex gap-2 items-center flex-col sm:flex-row">
        {IcpLinks.map(({ image, url, label }) => (
          <Link
            key={url}
            href={url}
            target="_blank"
            className="flex gap-1 items-center no-underline"
          >
            <Image src={image!} alt={label} width={14} height={14} />
            <Description className="hover:text-accent transition-colors">
              {label}
            </Description>
          </Link>
        ))}
      </div>
    </footer>
  );
}
