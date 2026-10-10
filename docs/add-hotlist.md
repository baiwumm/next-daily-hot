# 新增榜单指南

> **何时读**：新增或修改榜单数据源（平台）时。两步接入、上游抓取与反爬规范、错误处理、健康巡检都在这里。

---

## 两步接入

**第一步：注册榜单配置** —— 在 `src/config/hot-list.tsx` 的 `hotItemsConfig` 对应分类的 `children` 里加一行（`value` / `label` / `tip` 等，见 `HotListConfig` 类型）。`value` 即 API 路由目录名，**两处必须一致**（开发期有重复 value 断言兜底）。

**第二步：实现 API 路由** —— 新建 `src/app/api/<value>/route.ts`，用 `fetchJson` / `fetchText` 抓取上游，把结果映射为 `HotListItem[]` 后经 `successResponse()` 返回。

`HotListItem` 字段（`src/types/index.ts`）：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | ✅ | 唯一 key |
| `title` | ✅ | 标题 |
| `url` | ✅ | 详情地址 |
| `mobileUrl` | ✅ | 移动端地址 |
| `hot` | 可选 | 热度值 |
| `desc` / `pic` / `tip` / `label` | 可选 | 描述 / 封面图 / 替代热度的信息 / 标签（微博） |

特殊算法（签名、书籍 ID 换算等）放 `src/lib/` 独立模块，参考已有的 `weread.ts`、`miyoushe.ts`。

## 上游抓取规范

- **禁止绕过 `src/lib/request.ts` 裸写 `fetch`**：`fetchJson` / `fetchText` 统一注入 Chrome UA、15s 超时、`next.revalidate` 缓存策略。
- **上游反爬应对**（`buildHeaders` 已支持）：
  - 微博等需额外 `Referer`；
  - 个别站点对桌面 UA 返回反爬页，传 `'User-Agent': ''` 显式移除 UA。
- **上游挂掉属常态**：走 `errorResponse()` 返回，前端已处理空数据与错误态；不要让失败响应被 CDN 缓存（`errorResponse` 已是 `no-store`，勿破坏）。
- 改缓存窗口需三处同源评估（服务端 revalidate = CDN s-maxage = 客户端冷却，见 [architecture.md](./architecture.md) 架构要点）。

## 上游健康巡检

新榜单接入后自动纳入巡检，无需额外注册：`.github/workflows/health-check.yml` 每日 4 次（UTC 0/6/12/18）在 runner 上构建并启动生产服务，逐个请求本地回源的全部榜单 API。

- 判定：HTTP 200 + `code=200` + `data` 非空数组；异常时自动创建/更新 tracking issue（label: `upstream-health`），全部恢复后自动关闭。
- 巡检**不直连线上域名**——线上启用 Vercel Security Checkpoint，脚本类客户端会被 429 挑战页拦截（调试环境说明见 [development.md](./development.md)）。
