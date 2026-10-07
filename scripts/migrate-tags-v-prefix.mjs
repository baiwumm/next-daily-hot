#!/usr/bin/env node
/**
 * @description: 一次性迁移脚本：为历史 tag 补上 v 前缀（X.Y.Z → vX.Y.Z）
 * 仅改写 tag 引用与 GitHub Release 指向，不触碰任何提交；annotated 形态与 tag message 原样保留
 * （tagger 信息不保留，版本时间以提交与 Release 为准）。
 * 执行顺序经过设计，避免 GitHub Release 因旧 tag 被删而退回 draft：
 *   本地建新 tag → 推送新 tag → PATCH Release 指向新 tag（顺带修正名称与正文 compare 链接）
 *   → 删远端旧 tag → 删本地旧 tag → 修正 CHANGELOG.md 的 compare 链接。
 * 幂等：中途失败直接重跑即可续（已存在且同指向的 v tag、已指向新 tag 的 Release、已删除的旧 tag 均自动跳过）。
 * 前置条件：gh CLI 已登录且具备 repo 权限（token 失效先 `gh auth refresh`）；--apply 前强校验，
 * 因为不修正 Release 就删旧 tag 会让全部历史 Release 退回 draft。
 *
 * 用法：
 *   node scripts/migrate-tags-v-prefix.mjs           # dry-run 预览（默认）
 *   node scripts/migrate-tags-v-prefix.mjs --apply   # 实际执行
 */
/* eslint-disable no-console -- CLI 工具脚本，输出即功能 */
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const APPLY = process.argv.includes('--apply')
const scriptDir = dirname(fileURLToPath(import.meta.url))
const backupPath = join(scriptDir, 'tag-migration-backup.json')
const changelogPath = join(scriptDir, '..', 'CHANGELOG.md')

/** compare/3.10.0...3.10.1 → compare/v3.10.0...v3.10.1；两侧任一侧缺 v 都补齐（兼容先发版后迁移的混排链接） */
const compareLinkPattern = /(compare\/)(v?\d+\.\d+\.\d+)\.\.\.(v?\d+\.\d+\.\d+)/g
const withVPrefix = (_, prefix, from, to) =>
  `${prefix}${from.startsWith('v') ? from : `v${from}`}...${to.startsWith('v') ? to : `v${to}`}`

const sh = (cmd, options = {}) => execSync(cmd, { encoding: 'utf8', ...options }).trim()

const fail = (message) => {
  console.error(`✖ ${message}`)

  process.exit(1)
}

/** semver 升序比较，仅用于展示与执行顺序 */
const compareSemver = (a, b) => {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number))

  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]
}

/** 从 origin 解析 owner/repo（兼容 ssh 与 https 形式） */
const getRepo = () => {
  const url = sh('git remote get-url origin')
  const matched = url.match(/github\.com[:/](.+?)(?:\.git)?$/)

  if (!matched) fail(`无法从 origin 解析 GitHub 仓库：${url}`)

  return matched[1]
}

/** 一次取全 tag 清单：annotated tag 的 commit 用 *objectname（peeled），lightweight 取 objectname 本身 */
const listTags = () => {
  const format = ['%(refname:short)', '%(objecttype)', '%(objectname)', '%(*objectname)', '%(contents:subject)'].join('\t')
  const output = sh(`git for-each-ref refs/tags --format="${format}"`)

  return output
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [name, type, objectName, peeledCommit, message] = line.split('\t')

      return { name, type, message, commit: type === 'tag' ? peeledCommit : objectName }
    })
}

/** 分页拉取全部 GitHub Release（含 draft），gh 不可用时返回 null */
const fetchReleases = (repo) => {
  try {
    const releases = []

    for (let page = 1; ; page++) {
      const chunk = JSON.parse(sh(`gh api "repos/${repo}/releases?per_page=100&page=${page}"`))

      releases.push(...chunk)

      if (chunk.length < 100) break
    }

    return releases
  } catch {
    return null
  }
}

const repo = getRepo()
const tags = listTags()
const byName = new Map(tags.map((tag) => [tag.name, tag]))

/** 待迁移：全部无 v 前缀的 semver tag */
const migrations = tags
  .filter((tag) => /^\d+\.\d+\.\d+$/.test(tag.name))
  .map((tag) => ({ ...tag, newName: `v${tag.name}` }))
  .sort((a, b) => compareSemver(a.name, b.name))

if (!migrations.length) {
  console.log('没有需要迁移的 tag，全部已带 v 前缀。')

  process.exit(0)
}

for (const migration of migrations) {
  const existing = byName.get(migration.newName)

  if (!existing) continue

  // 幂等续跑：v tag 已存在时必须指向同一提交，否则人工介入
  if (existing.commit !== migration.commit) {
    fail(`${migration.newName} 已存在但指向不同提交（${existing.commit.slice(0, 7)}），请人工确认`)
  }

  migration.tagCreated = true
}

const releases = fetchReleases(repo)

if (APPLY && !releases) {
  fail('gh CLI 不可用或未登录（token 失效先执行 gh auth refresh）。不修正 Release 指向就删旧 tag 会让全部历史 Release 退回 draft，拒绝执行。')
}

const releaseByTag = new Map((releases ?? []).map((release) => [release.tag_name, release]))

// ---------- 预览 ----------

console.log(`仓库：${repo}`)
console.log(`待迁移 tag：${migrations.length} 个  模式：${APPLY ? '—— APPLY 实际执行 ——' : 'dry-run 预览（加 --apply 执行）'}`)
console.log('')
console.log('旧 tag → 新 tag | 提交 | 类型 | GitHub Release')

for (const { name, newName, commit, type, tagCreated } of migrations) {
  const release = releaseByTag.get(name)
  const releaseText = !releases ? 'gh 不可用，未检查' : release ? `有（id=${release.id}${release.draft ? '，draft' : ''}）` : '无'
  const state = tagCreated ? '（新 tag 已存在，续跑跳过创建）' : ''

  console.log(`${name} → ${newName} | ${commit.slice(0, 7)} | ${type === 'tag' ? 'annotated' : 'lightweight'} | ${releaseText}${state}`)
}

const changelogContent = readFileSync(changelogPath, 'utf8')
const changelogMatches = changelogContent.match(new RegExp(compareLinkPattern.source, 'g')) ?? []

console.log('')
console.log(`CHANGELOG.md 待修正 compare 链接：${changelogMatches.length} 处`)

if (!APPLY) {
  console.log('')
  console.log('以上为预览。确认无误后执行：node scripts/migrate-tags-v-prefix.mjs --apply')

  process.exit(0)
}

// ---------- 实际执行 ----------

const backup = {
  createdAt: new Date().toISOString(),
  repo,
  note: '迁移脚本中途失败的恢复依据；迁移验证无误后本文件可删除。',
  tags: migrations.map(({ name, newName, commit, type, message }) => {
    const release = releaseByTag.get(name)

    return { old: name, new: newName, commit, type, message, releaseId: release?.id ?? null }
  }),
}

writeFileSync(backupPath, `${JSON.stringify(backup, null, 2)}\n`)
console.log(`\n备份已写入：${backupPath}`)

// 1. 本地创建新 tag（幂等：已存在且同指向的跳过）
const toCreate = migrations.filter((migration) => !migration.tagCreated)

for (const { name, newName, commit, message, type } of toCreate) {
  // annotated 原样重建；lightweight 保持 lightweight
  if (type === 'tag') {
    sh(`git tag -a "${newName}" -m "${message.replace(/"/g, '\\"')}" "${commit}"`)
  } else {
    sh(`git tag "${newName}" "${commit}"`)
  }

  console.log(`本地创建 ${newName} ← ${commit.slice(0, 7)}`)
}
if (!toCreate.length) console.log('本地新 tag 均已存在，跳过创建')

// 2. 推送新 tag（已推送的同指向 tag 会 no-op，幂等）
sh(`git push origin ${migrations.map((migration) => migration.newName).join(' ')}`)
console.log(`已推送 ${migrations.length} 个新 tag 到 origin`)

// 3. PATCH Release：指向新 tag + 顺带修正名称与正文 compare 链接（已指向新 tag 的跳过）
for (const { name, newName } of migrations) {
  const release = releaseByTag.get(name)

  if (!release) continue
  if (release.tag_name === newName) continue

  const payload = { tag_name: newName }

  if (release.name === name || release.name === `Release ${name}`) {
    payload.name = release.name.replace(name, newName)
  }

  const fixedBody = (release.body ?? '').replace(compareLinkPattern, withVPrefix)

  if (fixedBody !== release.body) payload.body = fixedBody

  sh(`gh api -X PATCH "repos/${repo}/releases/${release.id}" --input -`, { input: JSON.stringify(payload) })
  console.log(`Release 已指向 ${newName}（id=${release.id}）`)
}

// 4. 删远端旧 tag（以远端实际存在为准，幂等）
const remoteTags = new Set(
  sh('git ls-remote --tags origin')
    .split('\n')
    .map((line) => line.replace(/^[^\t]+\trefs\/tags\//, '').replace(/\^\{\}$/, ''))
    .filter((name) => /^\d+\.\d+\.\d+$/.test(name)),
)
const remoteToDelete = [...remoteTags].filter((name) => byName.has(name))

if (remoteToDelete.length) {
  sh(`git push origin ${remoteToDelete.map((name) => `:refs/tags/${name}`).join(' ')}`)
}
console.log(`已删除远端旧 tag：${remoteToDelete.length} 个`)

// 5. 删本地旧 tag（以当前本地实际存在为准，幂等）
const localToDelete = sh('git tag --list --format="%(refname:short)"')
  .split('\n')
  .filter((name) => /^\d+\.\d+\.\d+$/.test(name))

for (const name of localToDelete) {
  sh(`git tag -d "${name}"`)
}
console.log(`已删除本地旧 tag：${localToDelete.length} 个`)

// 6. 修正 CHANGELOG.md 的 compare 链接
const updatedChangelog = changelogContent.replace(compareLinkPattern, withVPrefix)

if (updatedChangelog !== changelogContent) {
  writeFileSync(changelogPath, updatedChangelog)
  console.log(`CHANGELOG.md compare 链接已修正`)
}

console.log('')
console.log('迁移完成。后续事项：')
console.log('1. 其他本机 clone 执行 git fetch origin --prune --prune-tags 清理旧 tag 缓存')
console.log('2. 提交 CHANGELOG.md 变更（建议 chore: 历史 tag 迁移 v 前缀，修正 CHANGELOG 链接）')
console.log('3. 到 GitHub Releases 页抽查几个版本确认指向与正文正常；验证无误后可删除备份文件')
