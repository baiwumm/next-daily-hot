/* eslint-disable next/no-img-element */
/* eslint-disable react-refresh/only-export-components */
import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

import { ImageResponse } from 'next/og'

export const alt = process.env.NEXT_PUBLIC_APP_DESC
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://hot.baiwumm.com'
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || '今日热榜'
const APP_DESC = process.env.NEXT_PUBLIC_APP_DESC || '汇聚全网热点资讯，实时掌握热门趋势'
const APP_HOST = APP_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')
const AUTHOR_NAME = process.env.NEXT_PUBLIC_AUTHOR_NAME || '白雾茫茫丶'
const AUTHOR_ROLE = process.env.NEXT_PUBLIC_AUTHOR_ROLE || '独立开发者'

const ASSET_MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

// Vercel 最佳实践：静态 I/O 提升到模块级，只读一次，避免每次请求重复 readFile
const bgAsset = publicAssetToDataUrl('og-bg.jpg')
const logoAsset = publicAssetToDataUrl('logo.png')
const previewAsset = publicAssetToDataUrl('og-preview.png')
const avatarAsset = publicAssetToDataUrl('avatar.jpg')

export default async function OpenGraphImage() {
  const [bgUrl, logoUrl, previewUrl, avatarUrl] = await Promise.all([
    bgAsset,
    logoAsset,
    previewAsset,
    avatarAsset,
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: '#F8FAFC',
          color: '#0F172A',
        }}
      >
        <img
          aria-hidden="true"
          alt=""
          height={630}
          src={bgUrl}
          width={1200}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(15, 23, 42, 0.18) 0%, rgba(15, 23, 42, 0.08) 36%, rgba(15, 23, 42, 0) 60%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            inset: '-20% auto auto -8%',
            width: '420px',
            height: '420px',
            borderRadius: '9999px',
            background: 'rgba(148, 163, 184, 0.14)',
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            inset: 'auto -12% -22% auto',
            width: '480px',
            height: '480px',
            borderRadius: '9999px',
            background: 'rgba(15, 23, 42, 0.06)',
          }}
        />
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            padding: '48px',
            boxSizing: 'border-box',
            gap: '36px',
          }}
        >
          <div
            style={{
              width: '46%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '6px 0 8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                alignSelf: 'flex-start',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.28)',
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0.18) 100%)',
                boxShadow:
                  '0 12px 28px rgba(15, 23, 42, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                padding: '12px 18px',
              }}
            >
              <img
                alt={APP_NAME}
                height={28}
                src={logoUrl}
                width={28}
                style={{
                  borderRadius: '8px',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  {APP_NAME}
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                maxWidth: '430px',
                marginTop: '-24px',
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: 36,
                  fontWeight: 900,
                  lineHeight: 1.2,
                  letterSpacing: '-0.04em',
                  color: 'rgba(255, 255, 255, 0.96)',
                }}
              >
                {APP_DESC}
              </h1>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                alignSelf: 'flex-start',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: '48px',
                  height: '48px',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}
              >
                <img
                  alt={AUTHOR_NAME}
                  height={48}
                  src={avatarUrl}
                  width={48}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '9999px',
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: 'rgba(255, 255, 255, 0.92)',
                  }}
                >
                  {AUTHOR_NAME}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    color: 'rgba(255, 255, 255, 0.64)',
                  }}
                >
                  {AUTHOR_ROLE}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              width: '54%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '32px',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.78)',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                boxShadow: '0 28px 80px rgba(15, 23, 42, 0.14)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.72)',
                  borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    position: 'absolute',
                    left: '22px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      width: 12,
                      height: 12,
                      borderRadius: '9999px',
                      background: '#F87171',
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      width: 12,
                      height: 12,
                      borderRadius: '9999px',
                      background: '#FBBF24',
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      width: 12,
                      height: 12,
                      borderRadius: '9999px',
                      background: '#4ADE80',
                    }}
                  />
                </div>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '250px',
                    height: '34px',
                    padding: '0 18px',
                    borderRadius: '9999px',
                    background: '#F8FAFC',
                    border: '1px solid rgba(15, 23, 42, 0.06)',
                    fontSize: 16,
                    color: '#64748B',
                  }}
                >
                  https://
                  {APP_HOST}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  padding: '18px',
                  background: '#FFFFFF',
                }}
              >
                <img
                  alt={`${APP_NAME} preview`}
                  height={430}
                  src={previewUrl}
                  width={560}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}

async function publicAssetToDataUrl(filename: string) {
  const filePath = join(process.cwd(), 'public', filename)
  const mimeType = ASSET_MIME_TYPES[extname(filename).toLowerCase()]

  if (!mimeType) {
    throw new Error(`Unsupported OG asset type: ${filename}`)
  }

  const buffer = await readFile(filePath)
  return `data:${mimeType};base64,${buffer.toString('base64')}`
}
