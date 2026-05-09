<div align="center">

# 🚀 DevLog AI

**AI驱动的开发者日志助手** | **AI-Powered Developer Logging Assistant** | **AI驅動的開發者日誌助手**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/devlog-ai.svg)](https://www.npmjs.com/package/devlog-ai)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)

[English](#english) | [简体中文](#简体中文) | [繁體中文](#繁體中文)

</div>

---

<a name="简体中文"></a>
## 🎉 项目介绍

**DevLog AI** 是一款专为开发者设计的智能日志管理工具，帮助您自动捕获、智能分类、快速检索开发过程中的关键信息。无论是调试记录、代码片段、解决方案还是灵感闪现，DevLog AI 都能帮您妥善保存并智能组织。

### 💡 灵感来源

在日常开发中，我们经常遇到：
- 🔍 解决了棘手的问题却忘记记录解决方案
- 📝 重要的命令行操作散落在历史记录中难以查找
- 💭 灵光一现的想法没有及时保存而遗忘
- 📚 代码片段散落在各处，需要时找不到

DevLog AI 正是为了解决这些痛点而生！

### ✨ 核心特性

| 特性 | 描述 | 状态 |
|------|------|------|
| 🤖 **智能分类** | 自动识别日志类型（命令/代码/错误/解决方案等） | ✅ |
| 🏷️ **AI标签** | 智能推荐标签，支持自定义标签体系 | ✅ |
| 🔍 **全文检索** | 快速搜索所有历史日志内容 | ✅ |
| 📋 **剪贴板捕获** | 一键捕获剪贴板内容并保存 | ✅ |
| 📊 **统计分析** | 可视化展示日志统计和趋势 | ✅ |
| 🎨 **精美终端** | 彩色终端输出，支持多种主题 | ✅ |
| 💾 **本地存储** | SQLite本地数据库，数据安全可控 | ✅ |
| 📤 **导出功能** | 支持 JSON/Markdown/CSV 格式导出 | ✅ |

### 🚀 快速开始

#### 环境要求
- **Node.js** >= 16.0.0
- **npm** 或 **yarn**

#### 安装

```bash
# 全局安装
npm install -g devlog-ai

# 或使用 npx
npx devlog-ai
```

#### 基础使用

```bash
# 添加一条日志
devlog add "修复了数据库连接池溢出的问题" --type solution --tags "bug,postgres"

# 查看最近日志
devlog list

# 搜索日志
devlog search "数据库"

# 捕获剪贴板内容
devlog capture

# 查看统计
devlog stats
```

### 📖 详细使用指南

#### 添加日志

```bash
# 基础添加
devlog add "日志内容"

# 完整参数
devlog add "日志内容" \
  --type solution \
  --category "debugging" \
  --tags "bug,fix,database" \
  --project "my-project" \
  --importance 5
```

**支持的日志类型：**
- `note` - 普通笔记
- `command` - 命令记录
- `code` - 代码片段
- `error` - 错误记录
- `solution` - 解决方案
- `reference` - 参考资料
- `idea` - 灵感想法

#### 列表与搜索

```bash
# 列出最近20条
devlog list

# 按类型筛选
devlog list --type error

# 按项目筛选
devlog list --project "my-project"

# 搜索关键词
devlog search "authentication"

# 高级搜索
devlog search "database" --type solution --category debugging
```

#### 剪贴板捕获

```bash
# 捕获当前剪贴板内容
devlog capture

# 捕获并添加备注
devlog capture --note "这是重要的配置代码"

# 捕获并指定分类
devlog capture --category "configuration" --tags "env,config"
```

#### 导出数据

```bash
# 导出为 JSON
devlog export --format json --output backup.json

# 导出为 Markdown
devlog export --format markdown --output logs.md

# 导出为 CSV
devlog export --format csv --output logs.csv
```

### 💡 设计思路

#### 技术选型
- **TypeScript** - 类型安全，开发体验佳
- **SQLite** - 轻量级本地数据库，无需配置
- **Commander.js** - 强大的 CLI 框架
- **Chalk** - 终端彩色输出
- **Inquirer** - 交互式命令行提示

#### 架构设计
```
┌─────────────────────────────────────────┐
│              CLI Interface              │
├─────────────────────────────────────────┤
│  Commands  │  Core  │  Utils  │  Types │
├─────────────────────────────────────────┤
│              SQLite Database            │
└─────────────────────────────────────────┘
```

### 📦 打包与部署

#### 本地开发

```bash
# 克隆仓库
git clone https://github.com/gitstq/DevLog-AI.git
cd DevLog-AI

# 安装依赖
npm install

# 构建
npm run build

# 本地运行
npm run dev

# 运行测试
npm test
```

#### 发布到 npm

```bash
# 登录 npm
npm login

# 发布
npm publish
```

### 🤝 贡献指南

我们欢迎所有形式的贡献！

1. **Fork** 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 **Pull Request**

#### 提交规范
- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具相关

### 📄 开源协议

本项目采用 [MIT](LICENSE) 协议开源。

---

<a name="english"></a>
## 🎉 Introduction

**DevLog AI** is an intelligent logging assistant designed specifically for developers, helping you automatically capture, intelligently categorize, and quickly retrieve critical information during the development process.

### 💡 Inspiration

In daily development, we often encounter:
- 🔍 Solved tricky problems but forgot to document the solutions
- 📝 Important command-line operations scattered in history, hard to find
- 💭 Brilliant ideas not saved in time and forgotten
- 📚 Code snippets scattered everywhere, can't find when needed

DevLog AI was born to solve these pain points!

### ✨ Key Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🤖 **Smart Classification** | Auto-detect log types (command/code/error/solution) | ✅ |
| 🏷️ **AI Tags** | Smart tag recommendations with custom tag support | ✅ |
| 🔍 **Full-text Search** | Quickly search all historical log content | ✅ |
| 📋 **Clipboard Capture** | One-click clipboard content capture | ✅ |
| 📊 **Statistics** | Visualize log statistics and trends | ✅ |
| 🎨 **Beautiful Terminal** | Colorful terminal output with multiple themes | ✅ |
| 💾 **Local Storage** | SQLite local database, data security guaranteed | ✅ |
| 📤 **Export** | Export to JSON/Markdown/CSV formats | ✅ |

### 🚀 Quick Start

#### Requirements
- **Node.js** >= 16.0.0
- **npm** or **yarn**

#### Installation

```bash
# Global installation
npm install -g devlog-ai

# Or use npx
npx devlog-ai
```

#### Basic Usage

```bash
# Add a log entry
devlog add "Fixed database connection pool overflow issue" --type solution --tags "bug,postgres"

# View recent logs
devlog list

# Search logs
devlog search "database"

# Capture clipboard content
devlog capture

# View statistics
devlog stats
```

### 📖 Detailed Usage Guide

#### Adding Logs

```bash
# Basic add
devlog add "Log content"

# Full parameters
devlog add "Log content" \
  --type solution \
  --category "debugging" \
  --tags "bug,fix,database" \
  --project "my-project" \
  --importance 5
```

**Supported Log Types:**
- `note` - General notes
- `command` - Command records
- `code` - Code snippets
- `error` - Error records
- `solution` - Solutions
- `reference` - References
- `idea` - Ideas

#### Listing and Searching

```bash
# List recent 20
devlog list

# Filter by type
devlog list --type error

# Filter by project
devlog list --project "my-project"

# Search keywords
devlog search "authentication"

# Advanced search
devlog search "database" --type solution --category debugging
```

#### Clipboard Capture

```bash
# Capture current clipboard
devlog capture

# Capture with note
devlog capture --note "This is important config code"

# Capture with category
devlog capture --category "configuration" --tags "env,config"
```

#### Export Data

```bash
# Export as JSON
devlog export --format json --output backup.json

# Export as Markdown
devlog export --format markdown --output logs.md

# Export as CSV
devlog export --format csv --output logs.csv
```

### 💡 Design Philosophy

#### Tech Stack
- **TypeScript** - Type-safe, great dev experience
- **SQLite** - Lightweight local database, zero config
- **Commander.js** - Powerful CLI framework
- **Chalk** - Terminal colors
- **Inquirer** - Interactive CLI prompts

#### Architecture
```
┌─────────────────────────────────────────┐
│              CLI Interface              │
├─────────────────────────────────────────┤
│  Commands  │  Core  │  Utils  │  Types │
├─────────────────────────────────────────┤
│              SQLite Database            │
└─────────────────────────────────────────┘
```

### 📦 Build & Deploy

#### Local Development

```bash
# Clone repository
git clone https://github.com/gitstq/DevLog-AI.git
cd DevLog-AI

# Install dependencies
npm install

# Build
npm run build

# Run locally
npm run dev

# Run tests
npm test
```

#### Publish to npm

```bash
# Login to npm
npm login

# Publish
npm publish
```

### 🤝 Contributing

We welcome all forms of contributions!

1. **Fork** this repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create **Pull Request**

#### Commit Convention
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Build/tooling

### 📄 License

This project is open-sourced under the [MIT](LICENSE) License.

---

<a name="繁體中文"></a>
## 🎉 專案介紹

**DevLog AI** 是一款專為開發者設計的智能日誌管理工具，幫助您自動捕獲、智能分類、快速檢索開發過程中的關鍵資訊。

### 💡 靈感來源

在日常開發中，我們經常遇到：
- 🔍 解決了棘手的問題卻忘記記錄解決方案
- 📝 重要的命令行操作散落在歷史記錄中難以查找
- 💭 靈光一現的想法沒有及時保存而遺忘
- 📚 程式碼片段散落在各處，需要時找不到

DevLog AI 正是為了解決這些痛點而生！

### ✨ 核心特性

| 特性 | 描述 | 狀態 |
|------|------|------|
| 🤖 **智能分類** | 自動識別日誌類型 | ✅ |
| 🏷️ **AI標籤** | 智能推薦標籤 | ✅ |
| 🔍 **全文檢索** | 快速搜尋所有歷史日誌 | ✅ |
| 📋 **剪貼簿捕獲** | 一鍵捕獲剪貼簿內容 | ✅ |
| 📊 **統計分析** | 可視化展示日誌統計 | ✅ |
| 💾 **本地儲存** | SQLite本地數據庫 | ✅ |
| 📤 **匯出功能** | 支援多種格式匯出 | ✅ |

### 🚀 快速開始

#### 環境要求
- **Node.js** >= 16.0.0
- **npm** 或 **yarn**

#### 安裝

```bash
# 全域安裝
npm install -g devlog-ai
```

#### 基礎使用

```bash
# 新增一條日誌
devlog add "修復了資料庫連線問題" --type solution --tags "bug,postgres"

# 查看最近日誌
devlog list

# 搜尋日誌
devlog search "資料庫"

# 捕獲剪貼簿內容
devlog capture

# 查看統計
devlog stats
```

### 📄 開源協議

本專案採用 [MIT](LICENSE) 協議開源。

---

<div align="center">

**Made with ❤️ for Developers**

[⭐ Star us on GitHub](https://github.com/gitstq/DevLog-AI) | [🐛 Report Issue](https://github.com/gitstq/DevLog-AI/issues) | [💡 Request Feature](https://github.com/gitstq/DevLog-AI/issues)

</div>
