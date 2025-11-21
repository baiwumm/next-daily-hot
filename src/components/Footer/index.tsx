/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 09:43:44
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-11-21 10:10:10
 * @Description: 底部版权
 */
'use client'
import { Button, Chip, Divider, Image, Link, Spacer } from "@heroui/react";
import { RiBarChart2Line, RiMailLine, RiQuillPenLine } from "@remixicon/react";
import dayjs from 'dayjs';
import { ReactNode } from 'react';

import pkg from '../../../package.json';

type Social = {
  icon: ReactNode;
  url: string;
  label: string;
}

const ApiIcon = () => {
  return (
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16001" width={18} height={18}><path fill="currentColor" d="M169.12 293.92c-41.224 0-82.448 40.952-82.448 81.96v355.864H169.12V566.84h82.448v164.904h82.448V375.88c0-40.952-41.224-81.984-82.448-81.984l-82.448 0.024z m0 190.464V374.448h82.448v109.936H169.12zM471.44 292c-41.224 0-82.448 41.008-82.448 81.984v357.76H471.44V566.84h82.456c41.224 0 82.448-41.008 82.448-81.984V373.984c0-40.952-41.224-81.984-82.448-81.984H471.448z m0 192.384V374.448h82.456v109.936H471.448z m302.32-109.936v274.84H691.312v82.448h247.352V649.288h-82.448V374.448h82.448V293.92H691.312v80.528H773.76z" p-id="16002"></path></svg>
  );
};

export default function Footer() {
  // 社交图标
  const SocialLinks: Social[] = [
    {
      icon: <RiBarChart2Line size={18} />,
      url: 'https://um.baiwumm.com/share/MKEsllEeHKYZJl0Q',
      label: 'Umami'
    },
    {
      icon: <RiMailLine size={18} />,
      url: `mailto:${pkg.author.email}`,
      label: 'Email'
    },
    {
      icon: <ApiIcon />,
      url: 'https://api.baiwumm.com',
      label: 'Easy Api'
    },
    {
      icon: <RiQuillPenLine size={18} />,
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
              <Image src='/logo.svg' width={20} height={20} alt="Logo" />
              <span className="text-small font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</span>
            </div>
            <Divider className="h-4" orientation="vertical" />
            <Chip className="border-none px-0 text-default-500" color="success" variant="dot">
              服务状态正常
            </Chip>
          </div>
          <p className="text-center text-tiny text-default-400 md:text-start">
            &copy; {dayjs().format('YYYY')}
            <a
              href={pkg.author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {process.env.NEXT_PUBLIC_COPYRIGHT}
            </a>
            . All rights reserved.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 md:order-2">
          <div className="flex gap-2 items-center">
            {SocialLinks.map(({ icon, url, label }) => (
              <Button
                key={url}
                isIconOnly
                aria-label={label}
                variant="light"
                radius="full"
                size="sm"
                onPress={() => window.open(url)}>
                {icon}
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