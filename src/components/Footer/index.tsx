/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 09:43:44
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-20 13:48:55
 * @Description: 底部版权
 */
'use client'
import { Button, Chip, Divider, Image, Link, Spacer } from "@heroui/react";
import { Icon, type IconifyIconProps } from '@iconify-icon/react';
import dayjs from 'dayjs';

import pkg from '../../../package.json';

type Social = {
  icon: IconifyIconProps['icon'];
  url: string;
  label: string;
}

export default function Footer() {
  // 社交图标
  const SocialLinks: Social[] = [
    {
      icon: 'ri:bar-chart-2-line',
      url: 'https://um.baiwumm.com/share/MKEsllEeHKYZJl0Q',
      label: 'Umami'
    },
    {
      icon: 'ri:mail-line',
      url: `mailto:${pkg.author.email}`,
      label: 'Email'
    },
    {
      icon: 'mdi:api',
      url: 'https://api.baiwumm.com',
      label: 'Easy Api'
    },
    {
      icon: 'ri:quill-pen-line',
      url: pkg.author.url,
      label: 'Blog'
    }
  ]
  return (
    <footer className="flex w-full flex-col">
      <Divider />
      <div className="mx-auto w-full container! px-6 py-3 md:flex md:items-center md:justify-between">
        <div className="md:order-1">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <div className="flex items-center gap-2">
              <Image src='/logo.svg' width={30} height={30} alt="Logo" />
              <span className="text-small font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</span>
            </div>
            <Divider className="h-4" orientation="vertical" />
            <Chip className="border-none px-0 text-default-500" color="success" variant="dot">
              服务状态正常
            </Chip>
          </div>
          <p className="text-center text-tiny text-default-400 md:text-start mt-2">
            &copy; {dayjs().format('YYYY')}
            <a
              href={pkg.author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors ml-2"
            >
              {process.env.NEXT_PUBLIC_COPYRIGHT}
            </a>
            . All rights reserved.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 md:order-2 mt-2 sm:mt-0">
          <div className="flex gap-2 items-center">
            {SocialLinks.map(({ icon, url, label }) => (
              <Button
                key={url}
                isIconOnly
                aria-label={label}
                variant="flat"
                radius="full"
                size="sm"
                onPress={() => window.open(url)}>
                <Icon icon={icon} className="text-lg" />
              </Button>
            ))}
          </div>
          <div className="flex gap-2 items-center flex-col sm:flex-row">
            <Link href='https://beian.miit.gov.cn/#/Integrated/index' color="foreground" isExternal size="sm">
              <Image src='/icp.png' alt={process.env.NEXT_PUBLIC_ICP} width={16} height={16} />
              <Spacer x={1} />
              <span className="text-tiny text-default-400">{process.env.NEXT_PUBLIC_ICP}</span>
            </Link>
            <Link href='https://beian.mps.gov.cn/#/query/webSearch' color="foreground" isExternal size="sm">
              <Image src='/gongan.png' alt={process.env.NEXT_PUBLIC_GONGAN} width={16} height={16} />
              <Spacer x={1} />
              <span className="text-tiny text-default-400">{process.env.NEXT_PUBLIC_GONGAN}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}