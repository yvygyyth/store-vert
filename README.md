# Store Vert

一个类型安全、可扩展的存储库，提供统一的存储接口，支持多种存储方式。

## 特性

- 🎯 **类型安全** - 完整的 TypeScript 类型支持，提供类型推断和类型检查
- 🔌 **可扩展** - 基于注册表模式，轻松扩展自定义存储类型
- 📦 **多种存储方式** - 内置支持 Memory、LocalStorage、SessionStorage、IndexedDB
- 🚀 **统一 API** - 所有存储方式使用相同的 API 接口
- ⚡️ **轻量级** - 零依赖，体积小巧
- 🧪 **完整测试** - 100% 测试覆盖率，确保稳定性
- 📝 **TypeScript** - 完全使用 TypeScript 编写，提供完整的类型定义

## 安装

```bash
# 使用 pnpm（推荐）
pnpm add store-vert

# 使用 npm
npm install store-vert

# 使用 yarn
yarn add store-vert
```

## 快速开始

### 基本使用

```typescript
import { createStore, STORAGE_KEYS } from 'store-vert'

// 定义存储的数据结构
type UserSchema = {
  name: string
  age: number
  email: string
}

// 创建存储实例（使用内存存储）
const storage = createStore<UserSchema>(STORAGE_KEYS.memory)

// 设置值
storage.setItem('name', 'John')
storage.setItem('age', 25)
storage.setItem('email', 'john@example.com')

// 获取值
const name = storage.getItem('name') // 'John'
const age = storage.getItem('age')    // 25

// 删除值
storage.removeItem('name')

// 清空所有数据
storage.clear()

// 获取存储项数量
const count = storage.length()

// 获取所有键
const keys = storage.keys()

// 迭代所有项
storage.iterate((value, key, index) => {
  console.log(key, value, index)
})
```

### 使用不同的存储方式

```typescript
import { createStore, STORAGE_KEYS } from 'store-vert'

type AppSchema = {
  theme: 'light' | 'dark'
  language: string
}

// 使用 localStorage
const localStore = createStore<AppSchema>(STORAGE_KEYS.local)

// 使用 sessionStorage
const sessionStore = createStore<AppSchema>(STORAGE_KEYS.session)

// 使用 IndexedDB
const indexedDBStore = createStore<AppSchema>(STORAGE_KEYS.indexeddb)

// 使用内存存储（不持久化）
const memoryStore = createStore<AppSchema>(STORAGE_KEYS.memory)
```

### 复杂对象存储

```typescript
import { createStore, STORAGE_KEYS } from 'store-vert'

type ComplexSchema = {
  user: {
    id: number
    name: string
    profile: {
      avatar: string
      bio: string
    }
  }
  settings: {
    theme: string
    notifications: boolean
  }
}

const storage = createStore<ComplexSchema>(STORAGE_KEYS.local)

// 存储复杂对象
storage.setItem('user', {
  id: 1,
  name: 'John',
  profile: {
    avatar: 'https://example.com/avatar.jpg',
    bio: 'Developer'
  }
})

// 获取时会自动反序列化
const user = storage.getItem('user')
```

## API 文档

### createStore

创建存储实例的工厂函数。

```typescript
function createStore<Schema extends AnyRecord, K extends keyof ExtendStoreMap>(
  key: K,
  ...args: InjectStoreParameters<K>
): ExtendStoreMap<Schema>[K]
```

**参数：**
- `key`: 存储类型键（`STORAGE_KEYS.memory` | `STORAGE_KEYS.local` | `STORAGE_KEYS.session` | `STORAGE_KEYS.indexeddb`）
- `args`: 可选的存储初始化参数

**返回：** 增强的存储实例

### 存储实例方法

所有存储实例都实现了统一的接口：

#### setItem

设置存储项。

```typescript
setItem<K extends keyof Schema>(key: K, value: Schema[K]): Schema[K]
```

#### getItem

获取存储项。

```typescript
getItem<K extends keyof Schema>(key: K): Schema[K] | undefined
```

#### removeItem

删除存储项。

```typescript
removeItem<K extends keyof Schema>(key: K): void
```

#### clear

清空所有存储项。

```typescript
clear(): void
```

#### length

获取存储项数量。

```typescript
length(): number
```

#### keys

获取所有键的数组。

```typescript
keys(): Array<keyof Schema>
```

#### iterate

迭代所有存储项。

```typescript
iterate(
  callback: (value: Schema[keyof Schema], key: keyof Schema, index: number) => void
): void
```

## 支持的存储类型

### Memory Store

内存存储，数据仅存在于内存中，页面刷新后丢失。

```typescript
const storage = createStore<Schema>(STORAGE_KEYS.memory)
```

**特点：**
- 最快
- 不持久化
- 适合临时数据

### Local Storage

浏览器本地存储，数据持久化到本地。

```typescript
const storage = createStore<Schema>(STORAGE_KEYS.local)
```

**特点：**
- 持久化存储
- 跨标签页共享
- 存储限制约 5-10MB

### Session Storage

会话存储，数据仅在当前标签页有效。

```typescript
const storage = createStore<Schema>(STORAGE_KEYS.session)
```

**特点：**
- 标签页级别隔离
- 关闭标签页后清除
- 存储限制约 5-10MB

### IndexedDB

浏览器索引数据库，适合存储大量结构化数据。

```typescript
const storage = createStore<Schema>(STORAGE_KEYS.indexeddb)
```

**特点：**
- 大容量存储（通常数百MB）
- 支持复杂查询
- 异步操作

## 扩展自定义存储

你可以通过注册表模式添加自定义存储类型：

```typescript
import { inject, createStore } from 'store-vert'
import type { Store, AnyRecord } from 'store-vert'

// 定义自定义存储类
class CustomStore<Schema extends AnyRecord = AnyRecord> implements Store<Schema> {
  // 实现 Store 接口的所有方法
  getItem(key: keyof Schema): Schema[keyof Schema] | undefined {
    // 实现逻辑
  }
  // ... 其他方法
}

// 注册自定义存储
inject(CustomStore, 'custom')

// 使用自定义存储
const storage = createStore<Schema>('custom')
```

## 环境要求

- **Node.js**: >= 22.0.0
- **pnpm**: >= 8.0.0（推荐）
- **npm**: >= 9.0.0

## 开发

```bash
# 克隆仓库
git clone <repository-url>
cd store-vert

# 安装依赖
pnpm install

# 运行测试
pnpm test

# 运行测试（监听模式）
pnpm test:watch

# 运行测试（带覆盖率）
pnpm test:coverage

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 构建
pnpm build

# 类型检查
pnpm typecheck
```

## 项目结构

```
store-vert/
├── src/                    # 源代码
│   ├── modules/           # 存储模块实现
│   │   ├── memory/       # 内存存储
│   │   ├── local/        # localStorage
│   │   ├── session/      # sessionStorage
│   │   └── indexeddb/    # IndexedDB
│   ├── types/            # 类型定义
│   ├── utils/            # 工具函数
│   ├── constants/        # 常量定义
│   ├── registry.ts       # 注册表
│   ├── createStore.ts    # 工厂函数
│   └── index.ts          # 入口文件
├── tests/                # 测试文件
├── dist/                 # 构建输出
└── docs/                 # 文档
```

## 构建输出

构建后会生成以下文件：

- `dist/index.js` - CommonJS 格式
- `dist/index.esm.js` - ES Module 格式
- `dist/index.umd.js` - UMD 格式
- `dist/index.d.ts` - TypeScript 类型声明文件

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 作者

yvygyyth
