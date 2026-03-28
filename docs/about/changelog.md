# Changelog / 更新日志

本页用于记录本站较重要的内容更新、结构调整与页面优化。

## 2026-03-28

- 在 `mkdocs.yml` 中补充仓库信息，并启用 `View source of this page` 与 `Edit this page` 入口。
- 接入文档元数据插件，为页面底部补充 `last updated`、`created` 与 `contributors` 信息，并同步调整构建依赖与 CI 配置。
- 调整首页四张卡片的标题与文案，统一为中英双语表达，并补充协作说明页的跳转入口。
- 新增 [Collaboration / 协作说明](collaboration.md) 与 [Copyright & License / 版权与许可](copyright-license.md) 页面，补充 GitHub 参与方式与许可边界说明。
- 对部分站点说明文案进行润色，使表达更谦逊、邀请式，降低生硬感。
- 统一站点中的邮箱地址为 `zhangqiaohdu@outlook.com`，并补充 Python / pip / MkDocs 环境问题的简明记录。
- 调整本地预览时的 `contributors` 默认行为，并修复 `javascripts/mermaid.js` 的静态资源路径问题。
- 新增 `vercel.json`，统一 Vercel 的安装命令、构建命令与输出目录，避免部署环境继续沿用旧配置。

## 2026-03-27

- 拆分 [About This Site / 关于站点](site.md) 与 [Building This Site / 建站说明](site-building.md)，将“站点介绍”与“建站复盘”分离，目录结构更清晰。
- 调整 `About/关于` 导航结构，并统一 `about` 目录下页面的标题、命名与说明文字。
- 为非首页内容页增加 `Print / 打印` 按钮，并补充打印样式，方便保存或纸面阅读。
- 为建站说明中的常用命令补充注释，便于日后复用与回顾。
- 新增 [Acknowledgements / 致谢](acknowledgements.md) 页面，用于记录他人的建议与帮助。

## 2026-03-26

- 重写 [About Site / 关于站点](site.md) 页面，将原先偏流水记录的内容整理为更适合复盘与分享的结构化说明。
- 重新梳理站点建设思路，补充建站目标、工作流、部署关系、关键经验、工具理解与后续方向等内容。
- 为 [About Site / 关于站点](site.md) 增加可读性增强元素，包括 Admonitions、Mermaid 流程图与表格，使页面更适合快速浏览与长期参考。

## 2026-03-24

- 提交 [Naming Standards / 命名规范](../modeling/naming-standards.md) 初稿。
- 修改主页部分表达，使措辞更准确。

## 2026-03-22

- 以 [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) 官方主页为学习对象，借鉴其模板驱动思路（`template: home.html` + `overrides/home.html`），并基于本项目内容做了最小化重构。
