import type { Key, StoreFactory, Store, AnyRecord, InjectStoreMap } from '@/types'
import { type StoreKey } from '@/constants'

type StoreKeyConstructor = StoreKey | Key

// 实例容器：根据存储类型分别存储
const storageInstances = new Map<StoreKeyConstructor, StoreFactory<Store<AnyRecord>>>()

/**
 * 注入存储实例
 * @param storage 存储工厂函数
 * @param instanceKey 存储实例的唯一标识
 * @param storageType 存储类型（默认：unknown）
 * @throws 如果 key 已存在则抛出错误
 */
const inject = <K extends keyof InjectStoreMap>(storage: InjectStoreMap[K], instanceKey: K): void => {
    storageInstances.set(instanceKey, storage)
}

/**
 * 获取已注册的存储实例
 * @param key 存储实例的唯一标识
 * @returns 增强的存储实例
 */
function useStore<K extends keyof InjectStoreMap>(key: K): InjectStoreMap[K] {
    // 先从 storageInstances 获取该 key 的存储实例
    const instance = storageInstances.get(key)

    if (!instance) {
        throw new Error(`Store实例 ${String(key)} 未注册`)
    }

    return instance
}

export { inject, useStore }
