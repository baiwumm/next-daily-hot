/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-05-15 10:32:00
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-05-27 18:16:07
 * @Description: 底部版权信息
 */
import type { IconType } from 'react-icons';

import { Link, Spacer, Tooltip } from '@nextui-org/react';
import Image from 'next/image';
import { RiGithubLine, RiQuillPenLine, RiWechatLine, RiMailLine, RiBarChart2Line } from 'react-icons/ri';

import GlobalSetting from '@/components/GlobalSetting';

const Footer = () => {
  // 渲染备案
  const renderIcp = (url: string, icon: string, name: string = '') => (
    <Link href={url} color="foreground" isExternal size="sm" className="text-mode">
      <Image src={icon} alt={name} width={16} height={16} />
      <Spacer x={1} />
      {name}
    </Link>
  );

  // 渲染社交图标
  const renderSocial = (tip: string, url: string = '', Icon: IconType) => (
    <Tooltip showArrow content={tip} placement="top">
      <a href={url} target="_blank" className="btn-icon">
        <Icon size={20} />
      </a>
    </Tooltip>
  );
  return (
    <footer className="w-full">
      {/* 顶部分割线 */}
      <div className="flex items-center align-center text-center w-full flex-row">
        <div className="flex border-gray-200 dark:border-gray-800 w-full border-t border-solid"></div>
        <div className="font-medium text-gray-700 dark:text-gray-200 flex mx-3 whitespace-nowrap">
          <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 text-[10px] flex-shrink-0">
            <Image src="/logo.svg" alt="logo" width={20} height={20} />
          </span>
        </div>
        <div className="flex border-gray-200 dark:border-gray-800 w-full border-t border-solid"></div>
      </div>
      <div className="flex justify-between items-center px-4 md:px-8 lg:px-32 py-3 max-sm:flex-col -mt-2.5">
        {/* 备案 */}
        <div className="flex items-center gap-3 max-sm:flex-col">
          {renderIcp('https://beian.miit.gov.cn/#/Integrated/index', '/icp.png', process.env.SITE_ICP)}
          {renderIcp('https://beian.mps.gov.cn/#/query/webSearch', '/gongan.png', process.env.SITE_GUAN_ICP)}
        </div>
        {/* 社交图标 */}
        <div className="max-sm:order-first flex items-center">
          {/* 网站统计 */}
          {renderSocial('网站统计', process.env.SITE_STATISTICS, RiBarChart2Line)}
          {/* Github */}
          {renderSocial('Github', `https://github.com/${process.env.GITHUB_USERNAME}`, RiGithubLine)}
          {/* 微信 */}
          {renderSocial('微信', process.env.AUTHOR_WECHAT, RiWechatLine)}
          {/* 微信 */}
          {renderSocial('Email', `mailto:${process.env.AUTHOR_EMAIL}`, RiMailLine)}
          {/* 博客 */}
          {renderSocial('博客', process.env.AUTHOR_BLOG, RiQuillPenLine)}
          {/* 全局设置 */}
          <GlobalSetting />
        </div>
      </div>
    </footer>
  );
};
export default Footer;
