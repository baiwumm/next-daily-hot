/**
 * @description: README 徽章版本号同步（release-it 的 after:bump 钩子调用）
 * 以 package.json 依赖里固定的 Next.js 精确版本为准更新 README 的 Next 徽章，
 * 替代此前每次发版的手工同步；无变化时不写文件，避免产生多余的工作区改动。
 */
import { readFileSync, writeFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const nextVersion = pkg.dependencies.next
const readmePath = 'README.md'
const readme = readFileSync(readmePath, 'utf8')

// 徽章形如 https://img.shields.io/badge/Next-16.0-black?...，版本段截断于颜色段之前的 -
const pattern = /(https:\/\/img\.shields\.io\/badge\/Next-)([\w.]+)(-)/
const matched = readme.match(pattern)

if (!matched) {
  console.warn('README 未找到 Next 徽章，跳过同步')

  process.exit(0)
}

if (matched[2] === nextVersion) {
  console.log(`README Next 徽章已是 ${nextVersion}，无需更新`)

  process.exit(0)
}

writeFileSync(readmePath, readme.replace(pattern, `$1${nextVersion}$3`))

console.log(`README Next 徽章已同步：${matched[2]} → ${nextVersion}`)
