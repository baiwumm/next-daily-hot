# AGENTS.md — 今日热榜（daily-trending）开发指南

> 本文件是 AI Agent 与开发者的入口：只保留项目定位、常用命令与硬性规则。
> 详细规范按任务拆分在 `docs/` 分册，动手前先按「文档索引」读对应分册。

---

## 项目概览

**今日热榜**：聚合微博、知乎、B 站、抖音、GitHub 等全网热门平台热榜的单页应用。
纯聚合前端——**无数据库、无自建后端**，数据由 Next.js Route Handlers（`src/app/api/<platform>/route.ts`）
在服务端抓取各平台上游接口，统一映射为 `HotListItem[]` 后返回给客户端渲染。

- 仓库：<https://github.com/baiwumm/daily-trending>，线上：<https://hot.baiwumm.com>（Vercel 部署）
- 单页面应用：唯一业务页面 `src/app/page.tsx`，一次渲染全部榜单卡片

## 文档索引

| 分册 | 内容 | 何时读 |
| --- | --- | --- |
| [docs/architecture.md](docs/architecture.md) | 技术栈、目录结构、数据流、缓存 / 响应契约 / 状态 / 动画 / SEO 等架构要点 | 改动架构、缓存、全局状态或页面结构前 |
| [docs/development.md](docs/development.md) | 代码风格、命名、注释、提交规范、UI 规范、环境变量、本地调试 | 写任何代码前 |
| [docs/add-hotlist.md](docs/add-hotlist.md) | 新增榜单两步法、上游抓取与反爬规范、健康巡检 | 新增或修改榜单数据源时 |
| [docs/release.md](docs/release.md) | 发版流程、tag 规则、README 徽章同步 | 发版或调整发版配置时 |
| [docs/ROADMAP.md](docs/ROADMAP.md) | 产品路线图与维护约定 | 规划新功能时 |

## 常用命令

```bash
pnpm install        # 安装依赖（包管理器仅 pnpm，有 pnpm-lock.yaml）
pnpm dev            # 开发服务器 http://localhost:3000
pnpm build          # 生产构建（依赖已提交的 .env）
pnpm start          # 运行生产构建
pnpm lint           # ESLint 检查（即格式化工具，无独立 format 命令）
pnpm lint:fix       # 自动修复
pnpm release        # 本地发版（备用）；常规发版走 Actions，见 docs/release.md
npx tsc --noEmit    # 类型检查（无独立 typecheck 脚本）
```

## AI Agent 代码生成规范

项目级 Skill 统一安装在 `.agents/skills/`，**涉及 HeroUI 组件或 React / Next.js 代码产出前必须先读对应 SKILL.md 并遵循其规则**：

1. **`heroui-react`**：HeroUI v3 组件开发指南（官方维护）——任何 HeroUI 组件任务（组件 API、主题与暗色模式、安装配置）先读它；仅适用 v3，勿套用 v2 知识。
2. **`vercel-react-best-practices`**：性能与正确性规则——新建组件/页面、数据获取、重构、性能与 bundle 优化前读（消除请求瀑布、避免 barrel 导入与重渲染、服务端缓存与并行抓取）。
3. **`vercel-composition-patterns`**：组件组合模式——组件设计、组件 API 设计、重构布尔 prop 泛滥 / prop drilling 前读（复合组件、状态提升、children 优先于 render props）；React 19 规则适用（禁用 `forwardRef`，用 `use()` 替代 `useContext()`）。

- **冲突裁决**：本文件、docs/ 分册与既有代码架构 > Skill 规则；规则细节以 Skill 目录内文件为准（`SKILL.md` 索引 → `rules/*.md` 分册）。
- **框架 API**：Next.js 框架行为以 `node_modules/next/dist/docs/` 内置文档为准（版本随依赖精确匹配，先查文档再写）。
- **不回退**：已有代码大量实践了上述规范（`useRequest` 竞态保护、zustand persist 版本化迁移、`fetchJson` 统一超时），改造时保持同等水准。

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
