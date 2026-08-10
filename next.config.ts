import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Next.js 16 + Turbopack 默认自动 tree-shake barrel 导入（如 @heroui/react），无需额外配置
  images: {
    unoptimized: true, // 禁用 Vercel 图片优化
  },
}

export default nextConfig
