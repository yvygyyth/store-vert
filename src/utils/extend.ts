import type { AsyncStorage, SyncStorage, AsyncEnhancedStorage, SyncEnhancedStorage } from '@/types'
import type { AnyRecord } from '@/types'
/**
 * 扩展异步存储，添加增强方法
 * @param storage 异步存储对象
 * @returns 增强的异步存储对象
 */
export function extendAsyncStorage(storage: AsyncStorage): AsyncEnhancedStorage<AnyRecord> {
    return {
        ...storage,
        // 获取值，如果值不存在，则返回默认值
        async getItemOrDefault<K extends keyof AnyRecord>(key: K, defaultValue: AnyRecord[K]): Promise<AnyRecord[K]> {
            const value = await storage.getItem(key as string)
            return value !== null ? value : defaultValue
        },

        // 是否存在值
        async hasItem<K extends keyof AnyRecord>(key: K): Promise<boolean> {
            const value = await storage.getItem(key as string)
            return value !== null
        },

        // 删除多个值
        async removeItems<K extends keyof AnyRecord>(keys: K[]): Promise<void> {
            await Promise.all(keys.map((key) => storage.removeItem(key as string)))
        },

        // 获取多个值
        async getItems<K extends keyof AnyRecord>(keys: K[]): Promise<(AnyRecord[K] | null)[]> {
            return await Promise.all(keys.map((key) => storage.getItem(key as string)))
        }
    }
}

/**
 * 扩展同步存储，添加增强方法
 * @param storage 同步存储对象
 * @returns 增强的同步存储对象
 */
export function extendSyncStorage(storage: SyncStorage): SyncEnhancedStorage<AnyRecord> {
    return {
        ...storage,
        // 获取值，如果值不存在，则返回默认值
        getItemOrDefault<K extends keyof AnyRecord>(key: K, defaultValue: AnyRecord[K]): AnyRecord[K] {
            const value = storage.getItem(key as string)
            return value !== null ? value : defaultValue
        },

        // 是否存在值
        hasItem<K extends keyof AnyRecord>(key: K): boolean {
            const value = storage.getItem(key as string)
            return value !== null
        },

        // 删除多个值
        removeItems<K extends keyof AnyRecord>(keys: K[]): void {
            keys.forEach((key) => storage.removeItem(key as string))
        },

        // 获取多个值
        getItems<K extends keyof AnyRecord>(keys: K[]): (AnyRecord[K] | null)[] {
            return keys.map((key) => storage.getItem(key as string))
        }
    }
}
