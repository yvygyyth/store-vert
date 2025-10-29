# 项目结构

```
libra-template/
├── .github/                          # GitHub 配置
│   └── workflows/
│       └── ci.yml                    # CI/CD 自动化配置
│
├── .vscode/                          # VSCode 编辑器配置
│   ├── extensions.json               # 推荐的扩展
│   ├── launch.json                   # 调试配置
│   ├── settings.json                 # 编辑器设置
│   └── tasks.json                    # 任务配置
│
├── docs/                             # 文档目录
│   ├── API.md                        # API 文档
│   ├── CONTRIBUTING.md               # 贡献指南
│   └── QUICK_START.md                # 快速开始指南
│
├── examples/                         # 使用示例
│   └── usage.ts                      # 完整的使用示例代码
│
├── src/                              # 源代码目录
│   ├── types/                        # 类型定义
│   │   └── index.ts                  # 通用类型定义
│   │
│   ├── utils/                        # 工具函数
│   │   ├── array.ts                  # 数组工具
│   │   ├── date.ts                   # 日期工具
│   │   ├── number.ts                 # 数字工具
│   │   ├── object.ts                 # 对象工具
│   │   └── string.ts                 # 字符串工具
│   │
│   └── index.ts                      # 主入口文件
│
├── tests/                            # 测试文件目录
│   ├── array.test.ts                 # 数组工具测试
│   ├── date.test.ts                  # 日期工具测试
│   ├── number.test.ts                # 数字工具测试
│   ├── object.test.ts                # 对象工具测试
│   └── string.test.ts                # 字符串工具测试
│
├── .editorconfig                     # 编辑器配置
├── .eslintrc.cjs                     # ESLint 配置
├── .gitignore                        # Git 忽略文件
├── .npmignore                        # npm 发布忽略文件
├── .npmrc                            # npm 配置
├── .prettierignore                   # Prettier 忽略文件
├── .prettierrc                       # Prettier 配置
├── CHANGELOG.md                      # 变更日志
├── LICENSE                           # MIT 许可证
├── package.json                      # 项目配置和依赖
├── PROJECT_STRUCTURE.md              # 本文件 - 项目结构说明
├── README.md                         # 项目说明文档
├── TEMPLATE_SETUP.md                 # 模板设置说明
├── tsconfig.json                     # TypeScript 配置
├── tsconfig.node.json                # Node 环境 TypeScript 配置
└── vite.config.ts                    # Vite 构建配置

构建输出（不在版本控制中）:
├── dist/                             # 构建输出目录
│   ├── index.js                      # CommonJS 格式
│   ├── index.esm.js                  # ES Module 格式
│   ├── index.umd.js                  # UMD 格式
│   ├── index.d.ts                    # TypeScript 类型声明
│   └── *.js.map                      # Source maps
│
├── coverage/                         # 测试覆盖率报告
└── node_modules/                     # 依赖包
```

## 文件说明

### 配置文件

| 文件 | 说明 |
|------|------|
| `.editorconfig` | 统一不同编辑器的代码风格 |
| `.eslintrc.cjs` | ESLint 代码检查规则 |
| `.prettierrc` | Prettier 代码格式化规则 |
| `.prettierignore` | Prettier 忽略的文件 |
| `.gitignore` | Git 忽略的文件 |
| `.npmignore` | npm 发布时忽略的文件 |
| `.npmrc` | npm 配置（镜像、安装选项等）|
| `tsconfig.json` | TypeScript 主配置 |
| `tsconfig.node.json` | Node 环境的 TypeScript 配置 |
| `vite.config.ts` | Vite 构建配置 |
| `package.json` | 项目元信息和依赖管理 |

### 源代码文件

| 文件/目录 | 说明 |
|----------|------|
| `src/index.ts` | 库的主入口，导出所有公共 API |
| `src/utils/*.ts` | 工具函数实现 |
| `src/types/index.ts` | TypeScript 类型定义 |

### 测试文件

| 文件 | 说明 |
|------|------|
| `tests/*.test.ts` | 单元测试文件，对应 src/utils 中的工具函数 |

### 文档文件

| 文件 | 说明 |
|------|------|
| `README.md` | 项目主文档，包含安装、使用等基本信息 |
| `TEMPLATE_SETUP.md` | 模板设置和使用说明 |
| `PROJECT_STRUCTURE.md` | 本文件，项目结构说明 |
| `CHANGELOG.md` | 版本变更记录 |
| `LICENSE` | MIT 开源许可证 |
| `docs/QUICK_START.md` | 详细的快速开始指南 |
| `docs/CONTRIBUTING.md` | 贡献代码的指南 |
| `docs/API.md` | 完整的 API 参考文档 |

### 示例文件

| 文件 | 说明 |
|------|------|
| `examples/usage.ts` | 展示如何使用库中的各种工具函数 |

### VSCode 配置

| 文件 | 说明 |
|------|------|
| `.vscode/settings.json` | 编辑器设置（格式化、保存时自动修复等）|
| `.vscode/extensions.json` | 推荐安装的 VSCode 扩展 |
| `.vscode/launch.json` | 调试配置 |
| `.vscode/tasks.json` | VSCode 任务配置（构建、测试等）|

### CI/CD 配置

| 文件 | 说明 |
|------|------|
| `.github/workflows/ci.yml` | GitHub Actions 自动化流程 |

## 构建产物

构建后会在 `dist/` 目录生成以下文件：

- **index.js** - CommonJS 格式，用于 Node.js
- **index.esm.js** - ES Module 格式，用于现代打包工具
- **index.umd.js** - UMD 格式，可在浏览器中直接使用
- **index.d.ts** - TypeScript 类型声明文件
- **\*.js.map** - Source map 文件，方便调试

## 代码组织原则

### 1. 按功能分类

工具函数按照功能类型分类在不同的文件中：
- `string.ts` - 字符串相关
- `array.ts` - 数组相关
- `object.ts` - 对象相关
- `date.ts` - 日期相关
- `number.ts` - 数字相关

### 2. 测试文件对应

每个工具函数文件都有对应的测试文件：
- `src/utils/string.ts` → `tests/string.test.ts`
- `src/utils/array.ts` → `tests/array.test.ts`
- ...

### 3. 统一入口

所有公共 API 都通过 `src/index.ts` 导出，使用者只需从主包导入：

```typescript
import { capitalize, unique, deepClone } from 'your-library-name'
```

### 4. 类型定义分离

通用的类型定义放在 `src/types/` 目录，与具体实现分离。

## 扩展指南

### 添加新的工具函数

1. 在 `src/utils/` 创建或编辑相应文件
2. 在 `src/index.ts` 中导出
3. 在 `tests/` 创建或编辑对应的测试文件
4. 更新 `docs/API.md`

### 添加新的类型定义

1. 在 `src/types/index.ts` 中添加类型
2. 在 `src/index.ts` 中导出（如果需要公开）

### 修改构建配置

- **输出格式**: 编辑 `vite.config.ts` 的 `formats` 选项
- **外部依赖**: 编辑 `vite.config.ts` 的 `external` 选项
- **TypeScript**: 编辑 `tsconfig.json`

## 依赖关系

```
项目根目录
│
├── package.json (定义依赖)
│
├── src/ (源代码)
│   ├── index.ts (导出所有 API)
│   ├── utils/ (工具函数实现)
│   └── types/ (类型定义)
│
├── tests/ (测试)
│   └── *.test.ts (使用 Vitest 测试 src 中的代码)
│
└── vite.config.ts (构建配置)
    └── 构建 src/ → dist/
```

## 工作流程

```
开发 → 测试 → 检查 → 构建 → 发布
 ↓      ↓      ↓       ↓       ↓
src/  tests/  lint   dist/   npm
```

1. **开发**: 在 `src/` 中编写代码
2. **测试**: 在 `tests/` 中编写测试，运行 `npm run test`
3. **检查**: 运行 `npm run lint` 和 `npm run typecheck`
4. **构建**: 运行 `npm run build` 生成 `dist/`
5. **发布**: 运行 `npm publish` 发布到 npm

## 注意事项

1. **不要提交构建产物**: `dist/`、`coverage/`、`node_modules/` 已在 `.gitignore` 中
2. **发布时包含必要文件**: `.npmignore` 控制发布到 npm 的文件
3. **保持测试覆盖率**: 目标 > 80%
4. **遵循代码规范**: 使用 ESLint 和 Prettier
5. **更新文档**: 添加新功能时更新相应文档

