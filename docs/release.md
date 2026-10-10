# 发版流程

> **何时读**：发版或调整发版配置（版本号、CHANGELOG、tag 规则）前。

---

## 常规发版（GitHub Actions）

发版统一走 `.github/workflows/release.yml`（workflow_dispatch，在 main 上触发）：

1. 触发（二选一）：Actions 页面选 patch / minor / major，或填自定义版本号；或命令行：
   ```bash
   gh workflow run release.yml -f bump=minor        # 自定义版本号用 -f version=v3.x.0
   ```
2. CI 先跑 `pnpm lint` + `pnpm build` 预检，**任一失败即中止、不产生任何提交**。
3. 通过后由 release-it 一次性完成：版本号 → CHANGELOG.md → `chore: Release v${version}` 提交 → tag → GitHub Release（提交作者为 github-actions[bot]）。
4. 发版提交推上 main 后 Vercel 自动部署生产；本地 `git pull --ff-only` 同步 Release 提交。

## 版本规则

- **tag 统一使用 `v` 前缀**（`.release-it.json` 的 `git.tagName` 显式锁定）。历史 tag 已于 2026-10-07 全部迁移为 v 前缀，GitHub Release 指向与 CHANGELOG 链接同步修正（一次性迁移脚本用后已删除，逻辑见 `4b172f2` 提交）。
- **版本号从最新 tag 顺延，不看 package.json**：main 上 package.json 可能滞后于最新 tag（Release 提交只在发版时产生），发版前先 `git tag` / `gh run list` 确认最新 tag，避免版本号预期错位。
- 权限仅 `contents: write`（最小化授权）；`.env` 已提交，build 无需注入密钥。

## 本地发版（备用）

`pnpm release` 需要本地 `GITHUB_TOKEN`，与 CI 共用 `.release-it.json`（含 `requireBranch: main` 限制），行为一致。常规发版优先走 Actions。

## 附：README 徽章同步

README 的 Next 徽章由 release-it `after:bump` 钩子（`scripts/sync-readme-badges.mjs`）按 package.json 中固定的 Next 版本自动同步，无需手工维护。
