import type { StoreClass, StoreFunction, ExtendStoreMap, AnyRecord, Key, Store, InjectStoreParameters } from '@/types'
import { useStore } from '@/registry'
import { extendStore } from '@/utils/extend'

// 实现
function createStore<Schema extends AnyRecord = AnyRecord, K extends keyof ExtendStoreMap = Key>(
    key: K,
    ...args: InjectStoreParameters<K>
): ExtendStoreMap<Schema>[K] {
    const storeClassOrFactory = useStore(key)

    let store: Store<Schema>

    // 先尝试作为类使用 new，如果失败则作为函数调用
    try {
        store = new (storeClassOrFactory as StoreClass<Store<AnyRecord>>)(...args) as Store<Schema>
    } catch {
        store = (storeClassOrFactory as StoreFunction<Store<AnyRecord>>)(...args) as Store<Schema>
    }

    return extendStore(store as Store<AnyRecord>) as ExtendStoreMap<Schema>[K]
}

export { createStore }
