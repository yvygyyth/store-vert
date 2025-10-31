import type { AnyRecord } from './commom'
import type { AsyncStorage, SyncStorage } from './inject'

export interface AsyncEnhancedStorage<Schema extends AnyRecord = AnyRecord> extends AsyncStorage<Schema> {
    // 获取值，如果值不存在，则返回默认值
    getItemOrDefault<K extends keyof Schema>(key: K, defaultValue: Schema[K]): Promise<Schema[K]>

    // 是否存在值
    hasItem<K extends keyof Schema>(key: K): Promise<boolean>

    // 删除多个值
    removeItems<K extends keyof Schema>(keys: K[]): Promise<void>

    // 获取多个值
    getItems<K extends keyof Schema>(keys: K[]): Promise<(Schema[K] | null)[]>
}

export interface SyncEnhancedStorage<Schema extends AnyRecord = AnyRecord> extends SyncStorage<Schema> {
    // 获取值，如果值不存在，则返回默认值
    getItemOrDefault<K extends keyof Schema>(key: K, defaultValue: Schema[K]): Schema[K]

    // 是否存在值
    hasItem<K extends keyof Schema>(key: K): boolean

    // 删除多个值
    removeItems<K extends keyof Schema>(keys: K[]): void

    // 获取多个值
    getItems<K extends keyof Schema>(keys: K[]): (Schema[K] | null)[]
}

export type EnhancedStorage<Schema extends AnyRecord = AnyRecord> =
    | AsyncEnhancedStorage<Schema>
    | SyncEnhancedStorage<Schema>
