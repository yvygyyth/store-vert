import type { SyncStore } from '@/types'
import type { AnyRecord } from '@/types'

export type MemoryStoreConstructor = {
    new (): MemoryStore
}

type MemoryMap<Schema extends AnyRecord = AnyRecord> = Map<keyof Schema, Schema[keyof Schema]>

export class MemoryStore<Schema extends AnyRecord = AnyRecord> implements SyncStore<Schema> {
    private store: MemoryMap<Schema> = new Map()
    getItem<K extends keyof Schema>(key: K): Schema[K] | undefined {
        return this.store.get(key) as Schema[K] | undefined
    }

    setItem<K extends keyof Schema>(key: K, value: Schema[K]): Schema[K] {
        this.store.set(key, value)
        return value
    }

    removeItem<K extends keyof Schema>(key: K): void {
        this.store.delete(key)
    }

    clear(): void {
        this.store.clear()
    }

    length(): number {
        return this.store.size
    }

    key(n: number): keyof Schema | undefined {
        return Array.from(this.store.keys())[n] as keyof Schema | undefined
    }

    keys(): (keyof Schema)[] {
        return Array.from(this.store.keys())
    }

    iterate(iteratee: <K extends keyof Schema>(value: Schema[K], key: K, iterationNumber: number) => void): void {
        let index = 0
        for (const [key, value] of this.store.entries()) {
            iteratee(value, key, index)
            index++
        }
    }
}
