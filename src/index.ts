// 注册内部模块 - 必须在其他导出之前执行
import { inject } from './registry'
import { MemoryStore } from './modules/memory'
import { LocalStore } from './modules/local'
import { SessionStore } from './modules/session'
import { IndexedDBStore } from './modules/indexeddb'
import { STORAGE_KEYS } from './constants'

inject(MemoryStore, STORAGE_KEYS.memory)
inject(LocalStore, STORAGE_KEYS.local)
inject(SessionStore, STORAGE_KEYS.session)
inject(IndexedDBStore, STORAGE_KEYS.indexeddb)

export * from './registry'
export * from './createStore'

// 导出类型定义
export * from './types'

// 导出常量
export * from './constants'
