# Changelog

## [3.6.2](https://github.com/baiwumm/next-daily-hot/compare/3.6.1...3.6.2) (2026-07-06)

### 💄 Styles | 风格

* 去除重复的样式 ([48594cf](https://github.com/baiwumm/next-daily-hot/commit/48594cf343e7cb6f083002cace8be3260d650462))

## [3.6.1](https://github.com/baiwumm/next-daily-hot/compare/3.6.0...3.6.1) (2026-07-03)

### ✨ Features | 新功能

* **public:** 整理图片文件 ([1dd7889](https://github.com/baiwumm/next-daily-hot/commit/1dd78894101c4fb187b792e4ef9e6145da7d020a))

## [3.6.0](https://github.com/baiwumm/next-daily-hot/compare/3.5.6...3.6.0) (2026-07-03)

### ✨ Features | 新功能

* 使用 @gravity-ui/icons 代替 lucide-react ([adaceb3](https://github.com/baiwumm/next-daily-hot/commit/adaceb38aedd879ee69516918c2a720645774297))
* **HotCard:** 使用 @tanstack/react-virtual 代替 react-window 实现虚拟列表 ([657377b](https://github.com/baiwumm/next-daily-hot/commit/657377b3a937f62495f198890d65085a3df6e65e))
* **TimeAndLunar:** 时间显示改用 NumberFlow 滚动，优化交互 ([23ef35e](https://github.com/baiwumm/next-daily-hot/commit/23ef35e0e553ac2003ee0d505c2bc19c34d34c5b))

### 🐛 Bug Fixes | Bug 修复

* 解决 github-trending tip 没数据的问题 ([8f44447](https://github.com/baiwumm/next-daily-hot/commit/8f4444796b3e6c0fed43036c7661431fe1591298))

### 💄 Styles | 风格

* 优化顶部和底部在小屏幕下的样式 ([241d3d7](https://github.com/baiwumm/next-daily-hot/commit/241d3d7eb7e42d26b859e56e78076c1fa7d6cad4))
* 优化首页背景和样式 ([b58ad61](https://github.com/baiwumm/next-daily-hot/commit/b58ad61dfca1ab53438f9474f8d9b916194c853e))
* Logo 给个圆角样式 ([b967952](https://github.com/baiwumm/next-daily-hot/commit/b9679526ae291291750ad5ac13a501655711c1f7))

### ⚡ Performance Improvements | 性能优化

* 删除没用的代码和依赖 ([15a4424](https://github.com/baiwumm/next-daily-hot/commit/15a442442cec325850ecc66db940c2bdbcdde179))
* 优化卡片加载样式 ([2535489](https://github.com/baiwumm/next-daily-hot/commit/253548967c232cf8a1b3e781b95d13d81ac0eefe))
* **Footer:** 使用 Chip 代替 Status 组件 ([380ef7a](https://github.com/baiwumm/next-daily-hot/commit/380ef7a11f0abd6838124a7a88bfc48950d24db2))

### 🔧 Continuous Integration | CI 配置

* 新增 @number-flow/react 包 ([a5caa1f](https://github.com/baiwumm/next-daily-hot/commit/a5caa1f048bd45aed24c03b2b59ae969cdcdd009))

## [3.5.6](https://github.com/baiwumm/next-daily-hot/compare/3.5.5...3.5.6) (2026-07-01)

### ✨ Features | 新功能

* 更新 demo 图 ([90195c9](https://github.com/baiwumm/next-daily-hot/commit/90195c9263757314e97f83e2e29a26025dbc541c))
* **Header:** 添加 Tooltip 显示 ([9d615e5](https://github.com/baiwumm/next-daily-hot/commit/9d615e512ed8cb8f0b63e69b3001a4bd6eacaf24))

### 💄 Styles | 风格

* 优化 UI 主题样式 ([6faa4fa](https://github.com/baiwumm/next-daily-hot/commit/6faa4fae27bd4f4287f592332b808346c001fa1a))

### 🔧 Continuous Integration | CI 配置

* 降低 eslint 到 v9 版本，优化 lint 语法 ([d02b5bf](https://github.com/baiwumm/next-daily-hot/commit/d02b5bfb48931f270926f20a3cd1ccbe75f0ee80))

## [3.5.5](https://github.com/baiwumm/next-daily-hot/compare/3.5.4...3.5.5) (2026-07-01)

### ✨ Features | 新功能

* 去除社交信息，优化底部版本 ([5fd6889](https://github.com/baiwumm/next-daily-hot/commit/5fd6889cd8ca200b916570133e272fe7f636cf8c))
* 删除 Umami 统计代码 ([aad3f86](https://github.com/baiwumm/next-daily-hot/commit/aad3f869c06e4b9e519d3e55f67c7059b3ba4e1a))

## [3.5.4](https://github.com/baiwumm/next-daily-hot/compare/3.5.3...3.5.4) (2026-06-26)

### 💄 Styles | 风格

* **components:** 更新 Status 组件 variant 样式 ([1a35542](https://github.com/baiwumm/next-daily-hot/commit/1a35542c5822682c16543bdef9d8b3208153b8d4))

### 🔧 Continuous Integration | CI 配置

* 更新 Hero UI 版本 ([9762d58](https://github.com/baiwumm/next-daily-hot/commit/9762d58a65c28b08cac2d6c88407277e626b19fb))
* 更新包版本 ([bdcbada](https://github.com/baiwumm/next-daily-hot/commit/bdcbada07e46e30c3ff8df6ecb93c707942b585c))

## [3.5.3](///compare/3.5.2...3.5.3) (2026-03-16)

### Performance Improvements

* 删除 ProgressCircle 组件 16e0142
* **BackTop:** 使用 Hero UI 的 ProgressCircle 组件，优化卡顿 a421747

## [3.5.2](///compare/3.5.1...3.5.2) (2026-03-11)

### Features

* **Footer:** 修改友情链接 286784f

### Performance Improvements

* 禁止 Image 图片优化 7e36173
* **OverflowDetector:** 优化页面主题切换卡顿的问题 68ff709

## [3.5.1](///compare/3.5.0...3.5.1) (2026-02-06)

### Performance Improvements

* **HotCard:** 优化暗黑主题过渡卡顿的问题 e65f42b
* TS 类型完善 32c56b5

## [3.5.0](///compare/3.4.2...3.5.0) (2026-01-26)

### Features

* 新增 36kr - 24小时热榜 64d6a6e
* 新增 爱范儿 - 快讯 ba71546
* 新增 虎嗅 - 最新资讯 1e09849
* 新增 知乎日报 - 推荐榜 b5e2088
* 新增 IT之家- 热榜 14c2d42

### Bug Fixes

* 修复 Modal 不能关闭的问题 df3d77c

### Performance Improvements

* 细节调整 22fdd08

## [3.4.2](///compare/3.4.1...3.4.2) (2026-01-26)

### Features

* 更新 Hero UI 版本，配置主题 03a7c3e

## [3.4.1](///compare/3.4.0...3.4.1) (2026-01-21)

### Features

* 新增 人人都是产品经理 - 热榜 79df423
* 新增 CSDN - 热榜 cd00515

### Performance Improvements

* 删除 console.log 3a452f6

## [3.4.0](///compare/3.3.1...3.4.0) (2026-01-20)

### Features

* 新增 Github - 热门仓库 8b90396
* 新增 HelloGithub - 精选 91ac5ac

### Performance Improvements

* **HotSettings:** 禁用 Modal 点击关闭 227bf46

## [3.3.1](///compare/3.3.0...3.3.1) (2026-01-15)

### Features

* **baidu:** 新增 label 标签字段 ba7d048
* **weibo:** 更改热度字段 1d81277

## [3.3.0](///compare/3.2.1...3.3.0) (2026-01-15)

### Features

* 新增 夸克-今日热点 80ff40f
* **HotSettings:** 添加“恢复默认设置”功能 361ed08

## [3.2.1](///compare/3.2.0...3.2.1) (2026-01-14)

### Features

* 新增 虎扑-步行街热帖 8fa301e

## [3.2.0](///compare/3.1.1...3.2.0) (2026-01-14)

### Features

* 新增 懂车帝-热搜榜 00c6b27
* 新增 小红书-实时热榜 b1b8c99
* **HotSettings:** 热榜支持拖拽排序显示 db6ce60

## [3.1.1](///compare/3.1.0...3.1.1) (2026-01-13)

### Performance Improvements

* 优化类型 05d9eab

## [3.1.0](///compare/3.0.1...3.1.0) (2026-01-12)

### Features

* **HotCard:** 更新时间逻辑优化，其它细节微调 8dc3cad
* **HotCard:** 新增列表虚拟滚动 1d7d5bf

## [3.0.1](///compare/3.0.0...3.0.1) (2026-01-05)

### Features

* update README.md 6e7d7d8

## [3.0.0](///compare/2.1.0...3.0.0) (2026-01-05)

### Bug Fixes

* 修复百度热搜榜接口异常的问题 d2f7e33

### Performance Improvements

* 优化 SEO 信息 e8ebfcb
* **eslint:** 优化 eslint 配置规则 be8d366

## [2.1.0](///compare/2.0.0...2.1.0) (2025-11-21)

### Features

* 安装配置 Hero UI a56d6ed
* 完成顶部和底部布局和相应交互逻辑 4ac9d70
* 完成热榜卡片内容的开发 fe8b370
* 完成主体内容、热榜卡片布局 308c32c
* 细节优化 087b0e0
* 新增 BackTop 回到顶部组件 74d7c77
* 新增 NotFound 页面 de91aa6
* 新增release-it @release-it/conventional-changelog 包 72d92bd
* **metadata:** 完善网站 Meta 信息 a498986
* update README.md a5d5168
* update README.md 86dca7c

## [2.0.0](///compare/1.6.6...2.0.0) (2025-11-19)
