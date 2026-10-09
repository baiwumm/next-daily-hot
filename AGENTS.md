# AGENTS.md — 今日热榜（daily-trending）开发指南

> 本文件指导 AI Agent 与开发者快速理解并参与本项目开发，动手前先通读本文。

---

## 项目概览

**今日热榜**：聚合微博、知乎、B 站、抖音、GitHub 等全网热门平台热榜的单页应用。
纯聚合前端——**无数据库、无自建后端**，数据由 Next.js Route Handlers（`src/app/api/<platform>/route.ts`）
在服务端抓取各平台上游接口，统一映射为 `HotListItem[]` 后返回给客户端渲染。

- 仓库：<https://github.com/baiwumm/daily-trending>，线上：<https://hot.baiwumm.com>（Vercel 部署）
- 单页面应用：唯一业务页面 `src/app/page.tsx`，一次渲染全部榜单卡片

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | Next.js 16.3.0（App Router + Turbopack）、React 19.2.8、TypeScript strict |
| UI | HeroUI 3.2.4（`@heroui/react`）+ Tailwind CSS v4（`@tailwindcss/postcss`） |
| 动画 | motion（`motion/react`，即 framer-motion v12+）、next-themes 明暗主题 |
| 状态 | zustand 5（`persist` 中间件 → localStorage） |
| 请求 | 服务端原生 `fetch`（经 `src/lib/request.ts` 封装）；客户端自研 `useRequest`（`src/hooks/use-request.ts`，**无** axios/SWR/ahooks） |
| 解析/工具 | cheerio（HTML 解析）、crypto-js（微信读书签名）、lunar-typescript（农历）、@tanstack/react-virtual（长列表虚拟滚动）、@dnd-kit（卡片拖拽排序） |
| 统计 | @vercel/analytics + 百度统计 + Google Analytics + Clarity（`src/components/Analytics`） |
| 工程 | pnpm、ESLint 10（react / react-hooks / jsx-a11y / typescript-eslint / import 插件组合）+ Prettier 3（经 eslint-plugin-prettier 接入）、release-it 发版（GitHub Actions 一键发版） |

无测试框架；发版 workflow（`.github/workflows/release.yml`）内置 lint + build 门禁，但无 PR 级 CI——提交前仍需自查 `pnpm lint` + `pnpm build`。

## 目录结构

```text
src/
├── app/
│   ├── layout.tsx          # 根布局：metadata / 主题 / 全局组件挂载
│   ├── page.tsx            # 首页（唯一业务页面，'use client'）
│   ├── globals.css         # Tailwind v4 入口 + HeroUI 主题变量
│   ├── sitemap.ts / robots.ts / manifest.json / opengraph-image.tsx  # SEO/PWA
│   └── api/<platform>/route.ts   # 各榜单 API（目录名 = 榜单 value，数量以 hotItemsConfig 为准）
├── components/             # 14 个组件，PascalCase 目录 + index.tsx
│   ├── HotCard/            # 榜单卡片（含 HotListVirtual 虚拟列表）
│   └── HotSettings/ Sortable/  # 卡片显示/隐藏/拖拽排序设置
├── enums/
│   ├── index.tsx           # HOT_ITEMS：全部榜单配置唯一数据源（分类/平台数量以此为准）
│   └── response.ts         # 响应码 + API_CACHE_SECONDS 缓存窗口
├── hooks/                  # use-request.ts（自研 useRequest）、use-is-mobile 等
├── lib/
│   ├── request.ts          # 上游请求公共层：fetchJson / fetchText（统一 UA、15s 超时、revalidate）
│   ├── response.ts         # successResponse / errorResponse（统一 IResponse + CDN 缓存头）
│   ├── utils.ts            # fromNow / formatNumber 等纯工具
│   └── weread.ts           # 微信读书书籍 ID 算法（crypto-js）
├── store/useAppStore.ts    # zustand 全局状态（更新时间/心跳/隐藏/排序，persist）
├── styles/fonts.css        # Maple Mono CN 自托管 @font-face（字体文件在 public/fonts/）
└── types/index.ts          # HotListConfig / HotListItem / IResponse 共享类型
.agents/skills/             # Agent Skills（见「AI Agent 代码生成规范」）
.github/workflows/          # CI：Release 一键发版（手动触发）+ 上游健康巡检（定时）
.heroui-docs/               # HeroUI 本地文档（工具生成，gitignore）
scripts/                    # Node 工具脚本（release-it 钩子等）
```

## 常用命令

```bash
pnpm install        # 安装依赖（包管理器仅 pnpm，有 pnpm-lock.yaml）
pnpm dev            # 开发服务器 http://localhost:3000
pnpm build          # 生产构建（构建依赖 .env，见「环境与依赖」）
pnpm start          # 运行生产构建
pnpm lint           # ESLint 检查（即格式化工具，无独立 format 命令）
pnpm lint:fix       # 自动修复
pnpm release        # 本地发版（备用，需本地 GITHUB_TOKEN）；常规发版走 Actions 的 Release workflow
npx tsc --noEmit    # 类型检查（无独立 typecheck 脚本）
```

- **常规发版**走 `.github/workflows/release.yml`（workflow_dispatch，在 main 上触发，patch / minor / major 或自定义版本号）：CI 先跑 `pnpm lint` + `pnpm build` 预检，再由 release-it 一次性完成版本号、CHANGELOG.md、`chore: Release v${version}` 提交、tag 与 GitHub Release；也可用 `gh workflow run release.yml -f bump=minor` 触发。
- **tag 统一使用 `v` 前缀**（`.release-it.json` 的 `git.tagName` 显式锁定）；历史 tag 已于 2026-10-07 全部迁移为 v 前缀，GitHub Release 指向与 CHANGELOG 链接同步修正（一次性迁移脚本用后已删除，逻辑见 `4b172f2` 提交）。
- 本地 `pnpm release` 为备用方式，与 CI 共用 `.release-it.json`（含 `requireBranch: main` 限制）。
- `pnpm dev` / `pnpm build` 无需任何上游密钥；上游接口不可达只影响榜单数据，不阻塞构建。

## 开发约定

- **代码风格**：ESLint（flat config）+ Prettier——Prettier 负责格式化，以 `prettier/prettier`（warn）接入 ESLint；`.prettierrc` 锁定单引号、无分号、`endOfLine: auto`、printWidth 120（延续项目原有风格基线）；`no-console`、未用变量（`_` 前缀豁免）为 warn。
- **import 顺序**（`import/order`，warn）：type → builtin → external → internal → parent/sibling/index，组间保留空行。
- **JSX props 排序**（`react/jsx-sort-props`，warn）：保留字最先 → shorthand 其次 → 其余字母序 → 回调最后；`react/self-closing-comp` 强制自闭合。
- **语句空行**（`padding-line-between-statements`）：`return` 前必须空行，声明语句与其他语句之间空行。
- 写完代码先 `pnpm lint:fix`，不要手写对抗格式化规则。
- **命名**：组件目录 PascalCase + `index.tsx`；hooks 文件 `use-xxx.ts`；store 文件 `useXxxStore.ts`；其余文件/变量 camelCase 或 kebab-case。
- **路径别名**：`@/*` → `src/*`，`#/*` → 项目根目录。
- **注释**：中文 JSDoc；源码文件保留文件头 `@Description` 注释惯例，说明放在「为什么」而非「做了什么」。
- **提交**：Conventional Commits + 中文描述（`feat:` / `fix:` / `perf:` / `chore:` / `refactor:` / `style:` / `docs:`），参考 `git log`；主干开发，分支 `main`。
- **UI**：一律使用 HeroUI 组件与 Tailwind 工具类；写 HeroUI v3 API 前先读 `.agents/skills/heroui-react` Skill，**不凭记忆写 API**（本地完整文档在 `.heroui-docs/react`，工具生成、已 gitignore）。

## AI Agent 代码生成规范（硬性规则）

以下 Skill 已安装于 `.agents/skills/`，**涉及 HeroUI 组件或 React / Next.js 代码产出前必须先读对应 SKILL.md 并遵循其规则**：

1. **`heroui-react`**（HeroUI v3 组件开发指南，官方维护）：任何 HeroUI 组件任务（组件 API、主题与暗色模式、`@heroui/react` 安装配置）先读它；**仅适用 v3，勿套用 v2 知识**（无需 Provider、复合组件 API、Tailwind v4 + `@heroui/styles`）。
2. **`vercel-react-best-practices`**（性能与正确性，70 条规则，来源 vercel-labs/agent-skills）：适用于新建组件/页面、数据获取、重构、性能优化、bundle 优化。重点：消除请求瀑布（`async-*`）、避免 barrel 导入与重渲染（`bundle-*` / `rerender-*`）、服务端缓存与并行抓取（`server-*`）。
3. **`vercel-composition-patterns`**（组件组合模式，来源 vercel-labs/agent-skills）：适用于组件设计、组件 API 设计、重构布尔 prop 泛滥 / prop drilling。重点：复合组件、状态提升进 Provider、显式变体组件、children 优先于 render props；项目为 React 19，`react19-*` 规则适用（禁用 `forwardRef`，用 `use()` 替代 `useContext()`）。

- **冲突裁决**：本文件与既有代码架构 > Skill 规则；规则细节以 Skill 目录内文件为准（`SKILL.md` 索引 → `rules/*.md` 分册，Vercel 两个 Skill 均附全文编译版 `AGENTS.md`）。
- **Skill 安装位置统一**：项目级 Skill 只维护 `.agents/skills/<skill-name>/` 一份，禁止复制到 `.claude/skills/` 等其他位置。
- Next.js 框架 API / 行为以 `node_modules/next/dist/docs/` 内置文档为准（版本随依赖精确匹配，先查文档再写框架 API）；如需文档索引可执行 `npx @next/codemod agents-md --output AGENTS.md` 重新生成。
- 本项目已有代码大量实践了上述规范（如 `useRequest` 的竞态保护、zustand persist 版本化迁移、fetchJson 统一超时），改造时保持同等水准，不要回退。

## 环境与依赖

- **`.env` 已提交到仓库**（gitignore 中 `!.env`），全部为 `NEXT_PUBLIC_*` 公开变量：站点名称/描述/URL、作者信息、ICP/公安备案号、百度/Google/Clarity 统计 ID。**构建必需**（`layout.tsx` 的 metadata 直接读取）。
- **新私密变量走 `.env.local`**（`.env.*` 被 ignore），命名大写下划线；服务端专用变量不加 `NEXT_PUBLIC_` 前缀。
- 可选变量：`NEXT_PUBLIC_HOT_CACHE_SECONDS` 覆盖缓存窗口（60~3600 秒，默认 300），服务端 revalidate、CDN 缓存头、客户端刷新冷却三处同源。
- **无数据库、无后端服务**；唯一外部依赖是各平台上游接口（部分有反爬，见「注意事项」）。
- `pnpm-workspace.yaml` 的 `overrides` 固定 `@adobe/react-spectrum@3.47.3`（HeroUI 依赖兼容），勿随意移除（pnpm 10+ 不再读取 package.json 内嵌的 `pnpm` 字段）。
- 新增依赖需克制：能用原生 API / 现有能力实现的不引库；引入前说明理由。

## 架构要点

**数据流**（单向）：

```text
上游平台接口
  → src/app/api/<value>/route.ts   （fetchJson：统一 Chrome UA + 15s 超时 + next.revalidate）
  → 映射为 HotListItem[]            （id/title/url/mobileUrl/hot/desc…）
  → successResponse()               （统一 IResponse + CDN 头 s-maxage=300, stale-while-revalidate=60）
  → 客户端 useRequest → HotCard     （useInView 进入视口才请求；手动刷新 URL 加时间戳绕过 CDN）
```

- **新增一个榜单 = 两步**：① `src/enums/index.tsx` 的 `hotItemsConfig` 在对应分类的 `children` 里加一行（`value` 即 API 路由目录名，两处必须一致，开发期有重复 value 断言）；② 新建 `src/app/api/<value>/route.ts`，抓取上游并映射为 `HotListItem[]`。特殊算法放 `src/lib/`。
- **缓存三层同源**：服务端 fetch `revalidate` = CDN `s-maxage` = 客户端刷新冷却，全部取自 `API_CACHE_SECONDS`（`src/enums/response.ts`）；改动缓存策略必须三处一起评估。
- **响应契约**：`IResponse { code, msg, data?, timestamp }` 固定；成功 `code=200`（可缓存），失败 `code=500` 且 `no-store`（避免错误被缓存）。前端依赖 `timestamp` 显示更新时间，勿改语义。
- **客户端状态**：`useAppStore`（zustand persist）。改持久化结构必须递增 `version` 并补 `migrate`；`now/tick` 心跳是派生基准，不持久化。相对时间与刷新冷却共用同一时钟保证自洽。
- **动画约束**：首页卡片网格的 FLIP 重排动画由**子级** `motion.div` 的 `layout` 承担；父级 grid 容器只承载 variants，**不要开启 `layout`**——父级变换补偿会在网格重排时叠加错位（见 `page.tsx` 注释）。
- **SEO**：`layout.tsx` metadata 的 keywords 由 `HOT_ITEMS` 派生；sitemap / robots / manifest / opengraph-image 均为 App Router 文件约定。

## 注意事项

- **上游反爬**：`fetchJson` 默认注入 Chrome UA；微博等需额外 `Referer`；个别站点对桌面 UA 返回反爬页，传 `'User-Agent': ''` 显式移除（`buildHeaders` 已支持）。禁止绕过 `src/lib/request.ts` 裸写 `fetch`。
- **上游挂掉属常态**：走 `errorResponse()` 返回，前端已处理空数据与错误态；不要让失败响应被 CDN 缓存。
- `.heroui-docs/`、`next-env.d.ts`、`.next/` 为工具/构建生成，勿手工编辑、勿提交。
- `src/app/page.tsx` 用 `mounted` 状态先渲染骨架再挂载内容，规避 SSR hydration 不匹配；客户端含随机性/读 localStorage 的 UI 需沿用此模式。
- 图片：`next.config.ts` 中 `images.unoptimized: true`（禁用 Next 图片优化），外链封面图直接原图输出。
- 线上域名当前启用 Vercel Security Checkpoint：脚本/curl 直连 `hot.baiwumm.com/api/*` 会拿到 429 挑战页（与 UA 无关），服务端巡检或接口调试请走本地构建服务（`pnpm build && pnpm start` 后访问 `127.0.0.1:3000`）；若日后关闭该模式可恢复直连。
- 全站中文注释与文案；README 的 Next 徽章由 release-it `after:bump` 钩子（`scripts/sync-readme-badges.mjs`）按 package.json 中固定的 Next 版本自动同步，无需手工维护。

## 禁止事项

1. 禁止修改 `IResponse` 响应结构与 `successResponse` / `errorResponse` 语义（前端全局依赖）。
2. 禁止绕过 `fetchJson` / `fetchText` 直接裸 `fetch` 上游（丢失 UA / 超时 / 缓存策略）。
3. 禁止让 `hotItemsConfig` 的 `value` 与 `src/app/api/` 目录名不一致——value 即路由路径，改名必须两处同步。
4. 禁止引入替代性基础库：UI 库（非 HeroUI）、状态库（非 zustand）、请求库（非原生 fetch + 自研 useRequest），除非用户明确要求并评估影响。
5. 禁止改动 `eslint.config.mjs` 与 Prettier 风格基线（与 better-admin/react 的 lint 体系对齐），新增代码以 `pnpm lint:fix` 适配。
6. 禁止手工编辑 `.heroui-docs/`（工具生成目录）；不要把工具生成的文档索引块（HeroUI / Next.js）写入本文件，保持 AGENTS.md 纯手写。
7. 禁止提交 `.env.local` 或任何私密密钥；`.env` 中只允许公开变量。
8. 禁止在未沟通的情况下升级 Next.js / HeroUI / React 大版本（历史上均为独立 `chore:` 提交，需配套回归验证）。
9. 禁止把 Skill 复制到 `.agents/skills/` 之外的位置（避免多副本漂移）。
