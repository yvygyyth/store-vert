import type { UseStorageOptions, StorageReturn } from '@/types'
import { useStorage } from '@/registry'

function createStore(options: UseStorageOptions): StorageReturn {
    const { key, ...rest } = options
    const storeClss = useStorage({ key })
    const store = new storeClss(rest)
    return store
}

export { createStore }
