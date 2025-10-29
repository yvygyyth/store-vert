# 模板设置指南

这是一个 TypeScript 工具库模板，帮助你快速创建自己的工具库。

## 环境要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0

```bash
# 安装 pnpm
npm install -g pnpm

# 检查版本
node -v
pnpm -v
```

## 快速开始

### 1. 克隆并初始化

```bash
# 克隆模板
git clone <your-repo-url> my-library
cd my-library

# 清理 git 历史
rm -rf .git
git init
```

### 2. 修改项目信息

编辑 `package.json`：
- `name` - 改为你的库名
- `description` - 改为你的描述
- `author` - 改为你的名字
- `repository.url` - 改为你的仓库地址

### 3. 安装依赖

```bash
pnpm install
```

### 4. 验证安装

```bash
pnpm test
pnpm build
```

## 项目结构说明

```
src/
├── utils/       # 工具函数（示例）
├── types/       # 类型定义
└── index.ts     # 入口文件

tests/           # 测试文件（示例）
examples/        # 使用示例
```

**注意**：`src/utils/` 和 `tests/` 中的文件只是示例，用于展示项目结构。你可以删除它们，从零开始编写自己的代码。

## 开发流程

### 1. 编写代码

在 `src/utils/` 创建你的工具函数：

```typescript
// src/utils/myUtils.ts
export function myFunction() {
  // your code
}
```

在 `src/index.ts` 中导出：

```typescript
export * from './utils/myUtils'
```

### 2. 编写测试

在 `tests/` 创建对应的测试：

```typescript
// tests/myUtils.test.ts
import { describe, it, expect } from 'vitest'
import { myFunction } from '../src/utils/myUtils'

describe('myFunction', () => {
  it('should work', () => {
    expect(myFunction()).toBeDefined()
  })
})
```

### 3. 运行测试

```bash
pnpm test         # 运行测试
pnpm test:watch   # 监听模式
```

### 4. 构建

```bash
pnpm build
```

构建后会在 `dist/` 目录生成：
- `index.js` - CommonJS
- `index.esm.js` - ES Module
- `index.umd.js` - UMD
- `index.d.ts` - TypeScript 声明

## 常用命令

```bash
pnpm dev           # 开发模式
pnpm build         # 构建
pnpm test          # 测试
pnpm test:watch    # 测试（监听）
pnpm lint          # 代码检查
pnpm lint:fix      # 自动修复
pnpm format        # 格式化
pnpm typecheck     # 类型检查
```

## 发布到 npm

```bash
# 1. 登录
npm login

# 2. 发布
pnpm publish
```

## 常见问题

### 1. 为什么强制使用 pnpm？

为了统一包管理器，避免 lock 文件冲突。如果不需要，可以：
- 删除 `scripts/preinstall.js`
- 删除 `package.json` 中的 `preinstall` 脚本

### 2. 示例代码可以删除吗？

可以！`src/utils/` 和 `tests/` 中的文件只是示例，删除后从零开始即可。

### 3. 如何添加外部依赖？

```bash
pnpm add package-name              # 生产依赖
pnpm add -D package-name           # 开发依赖
```

如果是生产依赖，记得在 `vite.config.ts` 中配置 `external`。

### 4. 支持哪些输出格式？

- **ESM** - 现代项目（Vite、Webpack 5+）
- **CJS** - Node.js 项目
- **UMD** - 浏览器直接引用

可以在 `vite.config.ts` 中修改。

## 工具链说明

- **Vite** - 构建工具
- **TypeScript** - 类型系统
- **Vitest** - 测试框架
- **ESLint** - 代码检查
- **Prettier** - 代码格式化

## 文档参考

- `README.md` - 项目说明
- `docs/QUICK_START.md` - 详细指南
- `docs/CONTRIBUTING.md` - 贡献指南
- `PROJECT_STRUCTURE.md` - 项目结构

## 获取帮助

如果遇到问题：
1. 查看 `docs/` 目录中的文档
2. 检查配置文件
3. 查看 GitHub Issues

祝开发愉快！🎉
