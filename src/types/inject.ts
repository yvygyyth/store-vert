import type { AnyRecord, Key } from './commom'
import type { AsyncifyObject } from './tool'
import type { STORAGE_KEYS } from '@/constants'
import type { IndexedDBStoreConstructor } from '@/modules/indexeddb'
import type { SessionStoreConstructor } from '@/modules/session'
import type { LocalStoreConstructor } from '@/modules/local'
import type { MemoryStoreConstructor } from '@/modules/memory'

export type SyncStore<Schema extends AnyRecord = AnyRecord> = {
    // 获取值
    getItem<K extends keyof Schema>(key: K): Schema[K] | undefined

    // 设置值
    setItem<K extends keyof Schema>(key: K, value: Schema[K]): Schema[K]

    // 删除值
    removeItem<K extends keyof Schema>(key: K): void

    // 清空存储
    clear(): void

    // 获取键数量
    length(): number

    // 获取所有键
    keys(): (keyof Schema)[]

    // 遍历所有数据
    iterate<R>(iteratee: <K extends keyof Schema>(value: Schema[K], key: K, iterationNumber: number) => R): void
}

export type AsyncStore<Schema extends AnyRecord = AnyRecord> = AsyncifyObject<SyncStore<Schema>>

export type Store<Schema extends AnyRecord = AnyRecord> = AsyncStore<Schema> | SyncStore<Schema>

export type StoreClass<Impl extends Store<AnyRecord>, Args extends unknown[] = unknown[]> = {
    new (...args: Args): Impl
}

export type StoreFunction<Impl extends Store<AnyRecord>, Args extends unknown[] = unknown[]> = (...args: Args) => Impl

export type StoreFactory<Impl extends Store<AnyRecord>, Args extends unknown[] = unknown[]> =
    | StoreClass<Impl, Args>
    | StoreFunction<Impl, Args>

export type InjectStoreMap = {
    [STORAGE_KEYS.memory]: MemoryStoreConstructor
    [STORAGE_KEYS.local]: LocalStoreConstructor
    [STORAGE_KEYS.session]: SessionStoreConstructor
    [STORAGE_KEYS.indexeddb]: IndexedDBStoreConstructor
    [key: Key]: StoreFactory<Store<AnyRecord>, any[]>
}

type ParametersOfStoreFactory<T> = T extends new (...args: infer P) => unknown
    ? P // 构造函数
    : T extends (...args: infer P) => unknown
      ? P // 函数
      : never

// 根据 key 提取参数类型
export type InjectStoreParameters<K extends keyof InjectStoreMap> = ParametersOfStoreFactory<InjectStoreMap[K]>
