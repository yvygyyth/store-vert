# Registry 使用示例

## 核心改进说明

通过 `validateAndCheckConsistency` 方法，现在可以一次完成**验证和类型判断**：

1. **自动识别存储类型**：通过检查方法是否为异步来判断是 AsyncStorage 还是 SyncStorage
2. **类型守卫**：使用 `storage is AsyncStorage` 模式，让 TypeScript 自动细化类型
3. **避免重复验证**：一个方法同时完成验证和类型判断，不需要多次调用
4. **自动分类存储**：根据类型自动将实例放入正确的 `instances` 容器中

## 核心方法

### 1. `validateAndCheckConsistency`

验证存储对象的完整性并判断是否为异步存储（类型守卫）。

**功能：**
- 检查所有必需方法是否存在
- 验证所有方法的同步/异步一致性
- 返回布尔值并细化类型（`storage is AsyncStorage`）

**类型签名：**
```typescript
function validateAndCheckConsistency(storage: Storage): storage is AsyncStorage
```

**使用示例：**
```typescript
if (validateAndCheckConsistency(storage)) {
    // TypeScript 知道这里 storage 是 AsyncStorage
    await storage.getItem('key')
} else {
    // TypeScript 知道这里 storage 是 SyncStorage
    storage.getItem('key')
}
```

### 2. `extendAsyncStorage` / `extendSyncStorage`

分别扩展异步和同步存储，添加增强方法。

**类型签名：**
```typescript
function extendAsyncStorage(storage: AsyncStorage): AsyncEnhancedStorage
function extendSyncStorage(storage: SyncStorage): SyncEnhancedStorage
```

**优势：**
- 不需要重复验证类型
- 函数签名明确，类型安全
- 每个函数职责单一

## 使用示例

### 示例 1：使用 createStore 创建存储实例（带默认值）

```typescript
import { createStore, STORAGE_KEYS } from 'store-vert'

// 定义 Schema 类型
interface UserSchema {
    name: string
    age: number
    email: string
}

// 创建带默认值的存储实例
const userStore = createStore<UserSchema>({
    key: STORAGE_KEYS.local,
    defaultValue: {
        name: 'Guest',
        age: 18
    }
})

// 类型推断：userStore 的 Schema 保持为 UserSchema
// 即 { name: string, age: number, email: string }
const name = await userStore.getItem('name') // 类型：string
const age = await userStore.getItem('age')   // 类型：number
const email = await userStore.getItem('email') // 类型：string
```

### 示例 2：使用 createStore 创建存储实例（不带默认值）

```typescript
import { createStore, STORAGE_KEYS } from 'store-vert'

// 定义 Schema 类型
interface UserSchema {
    name: string
    age: number
    email: string
}

// 创建不带默认值的存储实例
const userStore = createStore<UserSchema>({
    key: STORAGE_KEYS.local
})

// 类型推断：userStore 的 Schema 变为 MakeOptionalValues<UserSchema>
// 即 { name: string | undefined, age: number | undefined, email: string | undefined }
const name = await userStore.getItem('name') // 类型：string | undefined
const age = await userStore.getItem('age')   // 类型：number | undefined
const email = await userStore.getItem('email') // 类型：string | undefined

// 需要处理 undefined 的情况
if (name !== null && name !== undefined) {
    console.log(name.toUpperCase()) // 安全：TypeScript 知道 name 是 string
}
```

### 示例 3：注入异步存储（如 IndexedDB）

```typescript
import { inject, useStorage, STORAGE_KEYS } from 'store-vert'

// 假设这是一个 IndexedDB 的封装
const indexedDBStorage = {
    async getItem(key: string) {
        // IndexedDB 获取逻辑
        return null
    },
    async setItem(key: string, value: any) {
        // IndexedDB 设置逻辑
        return value
    },
    async removeItem(key: string) {
        // IndexedDB 删除逻辑
    },
    async clear() {
        // IndexedDB 清空逻辑
    },
    async length() {
        return 0
    },
    async key(n: number) {
        return ''
    },
    async keys() {
        return []
    },
    async iterate(iteratee: any) {
        return undefined
    }
}

// 注入存储实例
// validateAndCheckConsistency 会自动识别为 async 类型
// 并将其存储在 instances.async 中
inject(indexedDBStorage, STORAGE_KEYS.indexeddb)

// 使用存储实例
const storage = useStorage(STORAGE_KEYS.indexeddb)

// 现在可以使用增强方法
await storage.getItemOrDefault('user', { name: 'Guest' })
await storage.hasItem('user')
await storage.removeItems(['key1', 'key2'])
await storage.getItems(['key1', 'key2'])
```

### 示例 4：注入同步存储（如 localStorage）

```typescript
import { inject, useStorage, STORAGE_KEYS } from 'store-vert'

// 假设这是一个 localStorage 的封装
const localStorageAdapter = {
    getItem(key: string) {
        return localStorage.getItem(key)
    },
    setItem(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value))
        return value
    },
    removeItem(key: string) {
        localStorage.removeItem(key)
    },
    clear() {
        localStorage.clear()
    },
    length() {
        return localStorage.length
    },
    key(n: number) {
        return localStorage.key(n) || ''
    },
    keys() {
        return Object.keys(localStorage)
    },
    iterate(iteratee: any) {
        const keys = Object.keys(localStorage)
        let result
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const value = localStorage.getItem(key)
            result = iteratee(value, key, i)
        }
        return result
    }
}

// 注入存储实例
// validateAndCheckConsistency 会自动识别为 sync 类型
// 并将其存储在 instances.sync 中
inject(localStorageAdapter, STORAGE_KEYS.local)

// 使用存储实例
const storage = useStorage(STORAGE_KEYS.local)

// 现在可以使用增强方法（同步版本）
const user = storage.getItemOrDefault('user', { name: 'Guest' })
const exists = storage.hasItem('user')
storage.removeItems(['key1', 'key2'])
const items = storage.getItems(['key1', 'key2'])
```

### 示例 5：使用 `useStorageByType` 获取特定类型的存储

```typescript
import { useStorageByType, STORAGE_KEYS } from 'store-vert'

// 明确获取异步存储实例
const asyncStorage = useStorageByType(STORAGE_KEYS.indexeddb, 'async')
// TypeScript 知道这是 AsyncEnhancedStorage 类型
await asyncStorage.getItem('key')

// 明确获取同步存储实例
const syncStorage = useStorageByType(STORAGE_KEYS.local, 'sync')
// TypeScript 知道这是 SyncEnhancedStorage 类型
syncStorage.getItem('key')
```

### 示例 6：列出所有已注册的存储

```typescript
import { listStorages } from 'store-vert'

const storages = listStorages()
console.log('异步存储实例:', storages.async)
// 输出: ['indexeddb']

console.log('同步存储实例:', storages.sync)
// 输出: ['local', 'session', 'memory']
```

## 类型系统架构

```
Storage (基础接口)
├── AsyncStorage (异步存储接口)
│   └── AsyncEnhancedStorage (增强的异步存储)
│       └── instances.async (存储容器)
└── SyncStorage (同步存储接口)
    └── SyncEnhancedStorage (增强的同步存储)
        └── instances.sync (存储容器)
```

## 工作流程

1. **注入阶段** (`inject` 方法)
   ```
   传入 Storage 实例
   ↓
   validateAndCheckConsistency (验证 + 类型判断 + 类型守卫)
   ↓
   if (是异步) → extendAsyncStorage (扩展异步存储)
   else → extendSyncStorage (扩展同步存储)
   ↓
   存入对应的 instances[type] 容器
   ```

2. **使用阶段** (`useStorage` 方法)
   ```
   提供 instanceKey
   ↓
   在 instances.async 中查找
   ↓
   如果未找到，在 instances.sync 中查找
   ↓
   返回增强的存储实例
   ```

## defaultValue 参数说明

### 功能

`defaultValue` 参数用于在创建存储实例时提供默认值，它会影响类型推断：

- **传入 `defaultValue`**：Schema 类型保持不变，所有字段类型为原始类型
- **不传 `defaultValue`**：Schema 类型变为 `MakeOptionalValues<Schema>`，所有字段类型变为 `原始类型 | undefined`

### 类型定义

```typescript
type MakeOptionalValues<T extends AnyRecord> = {
    [K in keyof T]: T[K] | undefined
}
```

### 使用场景

1. **有默认值**：适用于有明确初始值的场景，类型更严格
2. **无默认值**：适用于可能不存在值的场景，类型更宽松，强制处理 undefined

### 最佳实践

```typescript
// ✅ 推荐：对于必需的配置，使用 defaultValue
const configStore = createStore<ConfigSchema>({
    key: STORAGE_KEYS.local,
    defaultValue: {
        theme: 'light',
        language: 'zh-CN'
    }
})

// ✅ 推荐：对于用户数据，不使用 defaultValue
const userDataStore = createStore<UserDataSchema>({
    key: STORAGE_KEYS.local
})

// 强制处理可能不存在的情况
const userData = await userDataStore.getItem('profile')
if (userData) {
    // 处理用户数据
}
```

## 优势

1. **类型安全**：TypeScript 会自动推断正确的类型
2. **自动分类**：无需手动指定存储类型，自动识别
3. **无重复验证**：只验证一次，两个扩展函数不再重复验证
4. **职责单一**：每个函数专注于一种存储类型的扩展
5. **易于扩展**：新的存储类型只需实现对应接口即可
6. **统一接口**：所有存储都提供一致的增强方法
7. **清晰分离**：async 和 sync 存储在不同容器中，便于管理
8. **无硬编码**：使用常量和类型系统，不使用魔法值
9. **智能类型推断**：根据是否提供 defaultValue 自动调整类型，提供更好的类型安全

