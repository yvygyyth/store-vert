import type { Storage, Key } from '@/types'
import { type StorageKey } from '@/constants'
import type { StorageInstance } from '@/types/useStorage'

// 实例容器：根据存储类型分别存储
export const instances = new Map<Key, Storage>()

/**
 * 注入存储实例
 * @param storage 原始存储对象（Storage）
 * @param instanceKey 存储实例的唯一标识
 */
const inject = (storage: Storage, instanceKey: StorageKey | Key): void => {
    instances.set(instanceKey, storage)
}

/**
 * 获取已注册的存储实例
 * @param options 配置选项
 * @returns 增强的存储实例
 */
function useStorage(options: StorageInstance): Storage {
    const { key } = options
    const instance = instances.get(key)
    if (!instance) {
        throw new Error(`Storage实例 ${String(key)} 未注册`)
    }
    return instance
}

export { inject, useStorage }
