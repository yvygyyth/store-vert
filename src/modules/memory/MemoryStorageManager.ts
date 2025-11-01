import type { AnyRecord } from '@/types'

export type MemoryStorageMap<Schema extends AnyRecord = AnyRecord> = Map<keyof Schema, Schema[keyof Schema]>

/**
 * 内存存储管理器
 * 管理全局的内存存储实例，支持多层命名空间
 */
class MemoryStorageManager {
    private storage = new Map<string, Map<string, Map<PropertyKey, unknown>>>()

    /**
     * 获取或创建存储实例
     * @param name 第一层命名空间
     * @param storeName 第二层命名空间
     * @param defaultValue 默认值
     * @returns 类型安全的 Map 实例
     */
    getOrCreateStore<Schema extends AnyRecord>(name: string, storeName: string): MemoryStorageMap<Schema> {
        // 获取或创建第一层
        if (!this.storage.has(name)) {
            this.storage.set(name, new Map())
        }
        const nameMap = this.storage.get(name)!

        // 获取或创建第二层
        if (!nameMap.has(storeName)) {
            const storeMap = new Map<keyof Schema, Schema[keyof Schema]>()
            nameMap.set(storeName, storeMap)
        }

        // 类型安全的转换
        return nameMap.get(storeName) as MemoryStorageMap<Schema>
    }
}

// 导出单例实例
export const storageManager = new MemoryStorageManager()
