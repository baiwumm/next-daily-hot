# 开发约定与环境

> **何时读**：写任何代码前。代码风格、命名、注释、提交规范、环境变量与本地调试注意事项都在这里。

---

## 代码风格

- **ESLint（flat config）+ Prettier**：Prettier 负责格式化，以 `prettier/prettier`（warn）接入 ESLint；`.prettierrc` 锁定单引号、无分号、`endOfLine: auto`、printWidth 120（延续项目原有风格基线）；`no-console`、未用变量（`_` 前缀豁免）为 warn。
- **import 顺序**（`import/order`，warn）：type → builtin → external → internal → parent/sibling/index，组间保留空行。
- **JSX props 排序**（`react/jsx-sort-props`，warn）：保留字最先 → shorthand 其次 → 其余字母序 → 回调最后；`react/self-closing-comp` 强制自闭合。
- **语句空行**（`padding-line-between-statements`）：`return` 前必须空行，声明语句与其他语句之间空行。
- 写完代码先 `pnpm lint:fix`，不要手写对抗格式化规则。

## 命名与路径

- **命名**：组件目录 PascalCase + `index.tsx`；hooks 文件 `use-xxx.ts`；store 文件 `useXxxStore.ts`；其余文件/变量 camelCase 或 kebab-case。
- **路径别名**：`@/*` → `src/*`，`#/*` → 项目根目录。

## 注释与文案

- 中文 JSDoc；源码文件保留文件头 `@Description` 注释惯例，说明放在「为什么」而非「做了什么」。
- 全站中文注释与文案。

## 提交规范

- Conventional Commits + 中文描述（`feat:` / `fix:` / `perf:` / `chore:` / `refactor:` / `style:` / `docs:`），参考 `git log`。
- 主干开发，分支 `main`；发版流程见 [release.md](./release.md)。

## UI 规范

- 一律使用 HeroUI 组件与 Tailwind 工具类。
- 写 HeroUI v3 API 前先读 `.agents/skills/heroui-react` Skill，**不凭记忆写 API**（本地完整文档在 `.heroui-docs/react`，工具生成、已 gitignore、勿手工编辑）。

## 环境与依赖

- **`.env` 已提交到仓库**（gitignore 中 `!.env`），全部为 `NEXT_PUBLIC_*` 公开变量：站点名称/描述/URL、作者信息、ICP/公安备案号、百度/Google/Clarity 统计 ID。**构建必需**（`layout.tsx` 的 metadata 直接读取）。
- **新私密变量走 `.env.local`**（`.env.*` 被 ignore），命名大写下划线；服务端专用变量不加 `NEXT_PUBLIC_` 前缀。禁止提交 `.env.local` 或任何私密密钥。
- 可选变量：`NEXT_PUBLIC_HOT_CACHE_SECONDS` 覆盖缓存窗口（60~3600 秒，默认 300），服务端 revalidate、CDN 缓存头、客户端刷新冷却三处同源。
- **无数据库、无后端服务**；唯一外部依赖是各平台上游接口（反爬与抓取规范见 [add-hotlist.md](./add-hotlist.md)）。
- `pnpm-workspace.yaml` 的 `overrides` 固定 `@adobe/react-spectrum@3.47.3`（HeroUI 依赖兼容），勿随意移除（pnpm 10+ 不再读取 package.json 内嵌的 `pnpm` 字段）。
- 新增依赖需克制：能用原生 API / 现有能力实现的不引库；引入前说明理由。
- `pnpm dev` / `pnpm build` 无需任何上游密钥；上游接口不可达只影响榜单数据，不阻塞构建。

## 生成物与本地调试

- `.heroui-docs/`、`next-env.d.ts`、`.next/` 为工具/构建生成，勿手工编辑、勿提交。
- **线上域名当前启用 Vercel Security Checkpoint**：脚本/curl 直连 `hot.baiwumm.com/api/*` 会拿到 429 挑战页（与 UA 无关），服务端巡检或接口调试请走本地构建服务（`pnpm build && pnpm start` 后访问 `127.0.0.1:3000`）；若日后关闭该模式可恢复直连。
- README 的 Next 徽章由 release-it `after:bump` 钩子（`scripts/sync-readme-badges.mjs`）按 package.json 中固定的 Next 版本自动同步，无需手工维护。
