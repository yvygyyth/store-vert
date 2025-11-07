import type { AnyRecord, Key } from './commom'
import type { SyncStore, AsyncStore } from './inject'
import type { AsyncifyObject } from './tool'
import type { STORAGE_KEYS } from '@/constants'

export type SyncStoreEnhanceMethods<Schema extends AnyRecord = AnyRecord> = {
    getItemOrDefault<K extends keyof Schema>(key: K, defaultValue: Schema[K]): Schema[K]
    hasItem<K extends keyof Schema>(key: K): boolean
    removeItems<K extends keyof Schema>(keys: K[]): void
    getItems<K extends keyof Schema>(keys: K[]): (Schema[K] | null)[]
}

export type AsyncStoreEnhanceMethods<Schema extends AnyRecord = AnyRecord> = AsyncifyObject<
    SyncStoreEnhanceMethods<Schema>
>

export type SyncEnhancedStore<Schema extends AnyRecord = AnyRecord> = SyncStore<Schema> &
    SyncStoreEnhanceMethods<Schema>

export type AsyncEnhancedStore<Schema extends AnyRecord = AnyRecord> = AsyncStore<Schema> &
    AsyncStoreEnhanceMethods<Schema>

export type EnhancedStore<Schema extends AnyRecord = AnyRecord> = AsyncEnhancedStore<Schema> | SyncEnhancedStore<Schema>

export type ExtendStoreMap<Schema extends AnyRecord = AnyRecord> = {
    [STORAGE_KEYS.memory]: SyncEnhancedStore<Schema>
    [STORAGE_KEYS.local]: SyncEnhancedStore<Schema>
    [STORAGE_KEYS.session]: SyncEnhancedStore<Schema>
    [STORAGE_KEYS.indexeddb]: AsyncEnhancedStore<Schema>
    [key: Key]: EnhancedStore<Schema>
}
