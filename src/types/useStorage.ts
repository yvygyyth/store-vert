import type { StorageKey } from '@/constants'
import type { Key } from './inject'
import type { AnyRecord } from './commom'

/**
 * useStorage 函数的参数配置
 */
export interface UseStorageOptions extends AnyRecord {
    /**
     * 存储实例的唯一标识（必选）
     */
    key: StorageKey | Key
}

export type StorageNamespace = Omit<UseStorageOptions, 'key'>

export type StorageInstance = Pick<UseStorageOptions, 'key'>
