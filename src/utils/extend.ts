import type { AsyncStore, SyncStore, AsyncEnhancedStore, SyncEnhancedStore, Store } from '@/types'
import type { AnyRecord } from '@/types'
import { isPromise } from './tool'
// 通用函数，用于注入增强方法
function injectMethods<T extends Store>(storage: T, methods: Record<string, Function>) {
    Object.assign(storage, methods)
}

/** 扩展异步存储 */
export function extendAsyncStore(storage: AsyncStore): AsyncEnhancedStore<AnyRecord> {
    injectMethods(storage, {
        async getItemOrDefault(key: keyof AnyRecord, defaultValue: any) {
            const value = await this.getItem(key as string)
            return value !== null ? value : defaultValue
        },
        async hasItem(key: keyof AnyRecord) {
            return (await this.getItem(key as string)) !== null
        },
        async removeItems(keys: (keyof AnyRecord)[]) {
            await Promise.all(keys.map((k) => this.removeItem(k as string)))
        },
        async getItems(keys: (keyof AnyRecord)[]) {
            return await Promise.all(keys.map((k) => this.getItem(k as string)))
        }
    })
    return storage as AsyncEnhancedStore<AnyRecord>
}

/** 扩展同步存储 */
export function extendSyncStore(storage: SyncStore): SyncEnhancedStore<AnyRecord> {
    injectMethods(storage, {
        getItemOrDefault(key: keyof AnyRecord, defaultValue: any) {
            const value = this.getItem(key as string)
            return value !== null ? value : defaultValue
        },
        hasItem(key: keyof AnyRecord) {
            return this.getItem(key as string) !== null
        },
        removeItems(keys: (keyof AnyRecord)[]) {
            keys.forEach((k) => this.removeItem(k as string))
        },
        getItems(keys: (keyof AnyRecord)[]) {
            return keys.map((k) => this.getItem(k as string))
        }
    })
    return storage as SyncEnhancedStore<AnyRecord>
}

/** 自动扩展存储类型（同步/异步） */
export function extendStore<T extends Store>(
    storage: T
): T extends AsyncStore ? AsyncEnhancedStore<AnyRecord> : SyncEnhancedStore<AnyRecord> {
    const testValue = storage.getItem('' as string & keyof AnyRecord)
    return (
        isPromise(testValue) ? extendAsyncStore(storage as AsyncStore) : extendSyncStore(storage as SyncStore)
    ) as T extends AsyncStore ? AsyncEnhancedStore<AnyRecord> : SyncEnhancedStore<AnyRecord>
}
