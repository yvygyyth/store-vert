# 快速开始指南

这是一份帮助你快速使用 Libra Template 创建自己的工具库的指南。

## 步骤 1: 克隆模板

```bash
git clone https://github.com/your-username/libra-template.git my-utils-library
cd my-utils-library
```

## 步骤 2: 清理 Git 历史

```bash
# 删除原始仓库的 git 信息
rm -rf .git

# 初始化新的 git 仓库
git init
git add .
git commit -m "Initial commit"
```

## 步骤 3: 修改项目信息

编辑 `package.json`，修改以下字段：

```json
{
  "name": "your-library-name",
  "version": "0.1.0",
  "description": "你的工具库描述",
  "author": "你的名字 <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/your-library-name.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/your-library-name/issues"
  },
  "homepage": "https://github.com/your-username/your-library-name#readme"
}
```

同时修改 `LICENSE` 文件中的版权信息。

## 步骤 4: 安装依赖

```bash
npm install
# 或者
pnpm install
# 或者
yarn install
```

## 步骤 5: 开发你的工具函数

### 5.1 创建新的工具函数文件

在 `src/utils/` 目录下创建你的工具函数文件：

```typescript
// src/utils/myUtils.ts
/**
 * 我的工具函数
 */

/**
 * 函数描述
 * @param param - 参数描述
 * @returns 返回值描述
 * @example
 * ```ts
 * myFunction('test') // 示例输出
 * ```
 */
export function myFunction(param: string): string {
  return `处理结果: ${param}`
}
```

### 5.2 在入口文件中导出

编辑 `src/index.ts`，添加你的工具函数导出：

```typescript
export * from './utils/myUtils'
```

### 5.3 编写测试

在 `tests/` 目录下创建对应的测试文件：

```typescript
// tests/myUtils.test.ts
import { describe, it, expect } from 'vitest'
import { myFunction } from '../src/utils/myUtils'

describe('My Utils', () => {
  describe('myFunction', () => {
    it('should work correctly', () => {
      expect(myFunction('test')).toBe('处理结果: test')
    })
  })
})
```

## 步骤 6: 运行测试和构建

```bash
# 运行测试
npm run test

# 运行测试（监听模式）
npm run test:watch

# 运行测试（带覆盖率）
npm run test:coverage

# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 代码格式化
npm run format

# 构建
npm run build
```

## 步骤 7: 发布到 npm

### 7.1 登录 npm

```bash
npm login
```

### 7.2 发布

```bash
npm publish
```

## 步骤 8: 在其他项目中使用

```bash
npm install your-library-name
```

```typescript
import { myFunction } from 'your-library-name'

const result = myFunction('test')
console.log(result)
```

## 项目结构说明

```
.
├── src/                    # 源代码
│   ├── utils/             # 工具函数
│   ├── types/             # 类型定义
│   └── index.ts           # 入口文件
├── tests/                 # 测试文件
├── examples/              # 使用示例
├── docs/                  # 文档
├── .github/               # GitHub 配置
│   └── workflows/         # CI/CD 配置
├── dist/                  # 构建输出（自动生成）
└── 配置文件...
```

## 常见问题

### 1. 如何删除不需要的工具函数？

1. 删除 `src/utils/` 中对应的文件
2. 从 `src/index.ts` 中移除对应的导出
3. 删除 `tests/` 中对应的测试文件

### 2. 如何添加外部依赖？

如果你的工具函数需要依赖其他包：

```bash
# 添加运行时依赖
npm install package-name

# 添加开发依赖
npm install -D package-name
```

然后在 `vite.config.ts` 中配置外部依赖：

```typescript
export default defineConfig({
  build: {
    lib: {
      // ...
    },
    rollupOptions: {
      external: ['package-name'],  // 添加外部依赖
      output: {
        globals: {
          'package-name': 'PackageName'
        }
      }
    }
  }
})
```

### 3. 如何自定义构建配置？

编辑 `vite.config.ts` 文件来自定义构建选项。

### 4. 如何配置 CI/CD？

项目已包含 GitHub Actions 配置（`.github/workflows/ci.yml`），它会在推送代码时自动运行测试和构建。

## 下一步

- 阅读 [贡献指南](./CONTRIBUTING.md)
- 查看 [示例代码](../examples/usage.ts)
- 完善你的 [README.md](../README.md)
- 添加更多工具函数！

## 获取帮助

如果遇到问题，可以：
- 查看项目的 [Issues](https://github.com/your-username/libra-template/issues)
- 阅读 [Vite 文档](https://vitejs.dev/)
- 阅读 [Vitest 文档](https://vitest.dev/)
- 阅读 [TypeScript 文档](https://www.typescriptlang.org/)

