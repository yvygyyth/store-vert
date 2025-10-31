import type { Storage, Key, AsyncEnhancedStorage, SyncEnhancedStorage } from '@/types'
import { STORAGE_TYPES, type StorageKey, type StorageType } from '@/constants'
import { validateAndCheckConsistency } from '@/utils/valid'
import { extendAsyncStorage, extendSyncStorage } from '@/utils/extend'
import type { AnyRecord } from '@/types'

// 实例容器：根据存储类型分别存储
const instances = {
    [STORAGE_TYPES.async]: new Map<Key, AsyncEnhancedStorage<AnyRecord>>(),
    [STORAGE_TYPES.sync]: new Map<Key, SyncEnhancedStorage<AnyRecord>>()
}

/**
 * 注入存储实例
 * @param storage 原始存储对象（AsyncStorage 或 SyncStorage）
 * @param instanceKey 存储实例的唯一标识
 */
const inject = (storage: Storage, instanceKey: StorageKey | Key): void => {
    // 验证并判断存储类型（返回 true 表示异步，false 表示同步）
    if (validateAndCheckConsistency(storage)) {
        // 异步存储：TypeScript 知道这里 storage 是 AsyncStorage
        const enhancedStorage = extendAsyncStorage(storage)
        instances[STORAGE_TYPES.async].set(instanceKey, enhancedStorage)
    } else {
        // 同步存储：TypeScript 知道这里 storage 是 SyncStorage
        const enhancedStorage = extendSyncStorage(storage)
        instances[STORAGE_TYPES.sync].set(instanceKey, enhancedStorage)
    }
}

/**
 * 获取已注册的存储实例
 * @param instanceKey 存储实例的唯一标识
 * @returns 增强的存储实例
 */
const useStorage = <Schema extends AnyRecord = AnyRecord>(
    instanceKey: StorageKey | Key
): AsyncEnhancedStorage<Schema> | SyncEnhancedStorage<Schema> => {
    // 先在异步实例中查找
    const asyncInstance = instances[STORAGE_TYPES.async].get(instanceKey)
    if (asyncInstance) return asyncInstance as AsyncEnhancedStorage<Schema>

    // 再在同步实例中查找
    const syncInstance = instances[STORAGE_TYPES.sync].get(instanceKey)
    if (syncInstance) return syncInstance as SyncEnhancedStorage<Schema>

    // 未找到则抛出错误
    throw new Error(`Storage实例 ${String(instanceKey)} 未注册`)
}

/**
 * 获取指定类型的存储实例
 * @param instanceKey 存储实例的唯一标识
 * @param type 存储类型（'async' 或 'sync'）
 * @returns 对应类型的增强存储实例
 */
const useStorageByType = <Schema extends AnyRecord = AnyRecord, T extends StorageType = StorageType>(
    instanceKey: StorageKey | Key,
    type: T
): T extends typeof STORAGE_TYPES.async ? AsyncEnhancedStorage<Schema> : SyncEnhancedStorage<Schema> => {
    const instance = instances[type].get(instanceKey)
    if (!instance) {
        throw new Error(`${type === STORAGE_TYPES.async ? '异步' : '同步'}Storage实例 ${String(instanceKey)} 未注册`)
    }
    return instance as T extends typeof STORAGE_TYPES.async ? AsyncEnhancedStorage<Schema> : SyncEnhancedStorage<Schema>
}

export { useStorage, useStorageByType, inject }
