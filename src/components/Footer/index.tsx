/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 09:43:44
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-11 16:35:42
 * @Description: 底部版权
 */
'use client'
import { Button, Description, Link, Separator, Tooltip } from "@heroui/react";
import dayjs from 'dayjs';
import { ChartColumn, Globe, House, IdCard, Mail } from 'lucide-react';
import Image from 'next/image';
import { type ReactNode } from 'react';

import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/Status";
import { ApiIcon } from '@/lib/icons';
import pkg from '#/package.json';

type Social = {
  icon?: ReactNode;
  image?: string;
  url: string;
  label: string;
}

export default function Footer() {
  // 社交图标
  const SocialLinks: Social[] = [
    {
      icon: <ChartColumn />,
      url: 'https://um.baiwumm.com/share/MKEsllEeHKYZJl0Q',
      label: 'Umami'
    },
    {
      icon: <Mail />,
      url: `mailto:${pkg.author.email}`,
      label: '邮箱'
    },
    {
      icon: <ApiIcon />,
      url: 'https://api.baiwumm.com',
      label: 'Easy Api'
    },
    {
      icon: <Globe />,
      url: 'https://dream.baiwumm.com',
      label: 'Dream Site'
    },
    {
      icon: <IdCard />,
      url: 'https://portfolio.baiwumm.com',
      label: '作品集'
    },
    {
      icon: <House />,
      url: pkg.author.url,
      label: '博客'
    }
  ]

  // 备案信息
  const IcpLinks: Social[] = [
    {
      image: '/icp.png',
      url: 'https://beian.miit.gov.cn/#/Integrated/index',
      label: process.env.NEXT_PUBLIC_ICP!
    },
    {
      image: '/gongan.png',
      url: 'https://beian.mps.gov.cn/#/query/webSearch',
      label: process.env.NEXT_PUBLIC_GONGAN!
    },
  ]
  return (
    <footer className="flex w-full flex-col" id="footer">
      <Separator />
      <div className="mx-auto w-full container! px-6 py-2 md:flex md:items-center md:justify-between">
        <div className="md:order-1">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <div className="flex items-center gap-2">
              <Image src='/logo.svg' width={20} height={20} alt="Logo" />
              <span className="text-sm font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</span>
            </div>
            <Separator className="h-4" orientation="vertical" />
            <Status variant="success">
              <StatusIndicator />
              <StatusLabel>服务状态正常</StatusLabel>
            </Status>
          </div>
          <Description className="text-center md:text-start mt-1">
            &copy; {dayjs().format('YYYY')} {" "}
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
        </div>
        <div className="flex flex-col items-center justify-center gap-1 md:order-2">
          <div className="flex gap-1 items-center">
            {SocialLinks.map(({ icon, url, label }) => (
              <Tooltip key={url}>
                <Button
                  isIconOnly
                  aria-label={label}
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  onPress={() => window.open(url)}>
                  {icon}
                </Button>
                <Tooltip.Content showArrow placement="top">
                  <Tooltip.Arrow />
                  {label}
                </Tooltip.Content>
              </Tooltip>
            ))}
          </div>
          <div className="flex gap-2 items-center flex-col sm:flex-row">
            {IcpLinks.map(({ image, url, label }) => (
              <Link key={url} href={url} target="_blank" className="flex gap-1 items-center no-underline">
                <Image src={image!} alt={label} width={14} height={14} />
                <Description className="hover:text-accent transition-colors">{label}</Description>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}