# Bridge Between Engineers

Bridge Between Engineers is a documentation site for mechanical engineering notes, standards, workflows, and practical insights.

工程师之间的桥梁，是一个围绕机械设计、加工、测量、规范与工程方法持续整理的文档站点。

Site:
[https://www.bridgezhang.com/](https://www.bridgezhang.com/)

Repository:
[https://github.com/bridgezhang123/bridge-zhang-technology-website](https://github.com/bridgezhang123/bridge-zhang-technology-website)

## What This Repository Contains

This repository contains:

- Markdown source files for the documentation site
- MkDocs configuration
- Material for MkDocs theme customization
- Small frontend scripts and styles used by the site

主要内容包括：

- 文档站点的 Markdown 源文件
- MkDocs 配置文件
- Material for MkDocs 的主题覆写
- 站点所需的少量脚本与样式

## Main Topics

The site currently focuses on:

- Mechanical design
- Modeling and drawing standards
- Manufacturing and process planning
- Measurement and inspection
- Reusable engineering workflows and methods

目前主要覆盖：

- 机械设计
- 建模与出图规范
- 制造与工艺规划
- 测量与检验
- 可复用的工程工作流与方法

## Local Development

Install dependencies:

```powershell
python -m pip install -r requirements.txt
```

Run the local preview server:

```powershell
python -m mkdocs serve
```

If your local environment runs into temporary-directory permission issues on Windows, you can use:

```powershell
python -m mkdocs serve --dirty
```

Build the static site locally:

```powershell
python -m mkdocs build
```

## Project Structure

```text
docs/           Markdown source files and static assets
overrides/      Theme overrides
.github/        GitHub Actions workflow
mkdocs.yml      Site configuration
requirements.txt  Python dependencies
```

## Contributing

Suggestions, corrections, and contributions are welcome.

You can contribute by:

1. Opening an `Issue`
2. Submitting a `Pull Request`
3. Sending feedback by email

Email:
`zhangqiaohdu@outlook.com`

For more details, see:
[docs/about/collaboration.md](docs/about/collaboration.md)

## License

Code and configuration in this repository are licensed under the MIT License.

Text, images, and other content are described separately in the site documentation:
[docs/about/copyright-license.md](docs/about/copyright-license.md)

## Related Pages

- [About This Site](docs/about/site.md)
- [Building This Site](docs/about/site-building.md)
- [Changelog](docs/about/changelog.md)
