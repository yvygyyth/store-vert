import type { AsyncStore, AnyRecord } from '@/types'

export type IndexedDBStoreConstructor = {
    new (name: string, storeName: string): IndexedDBStore
}

/**
 * IndexedDB 存储类
 * 基于浏览器的 IndexedDB 实现
 */
export class IndexedDBStore<Schema extends AnyRecord = AnyRecord> implements AsyncStore<Schema> {
    private dbName: string
    private storeName: string
    private dbPromise: Promise<IDBDatabase> | null = null
    private readonly DB_VERSION = 1

    constructor(name: string, storeName: string) {
        this.dbName = name
        this.storeName = storeName
        this.initDB()
    }

    /**
     * 初始化数据库连接
     */
    private initDB(): void {
        if (typeof window === 'undefined' || !window.indexedDB) {
            console.warn('IndexedDB is not available')
            return
        }

        this.dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.DB_VERSION)

            request.onerror = () => {
                reject(new Error(`Failed to open database: ${this.dbName}`))
            }

            request.onsuccess = () => {
                resolve(request.result)
            }

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName)
                }
            }
        })
    }

    /**
     * 获取数据库实例
     */
    private async getDB(): Promise<IDBDatabase> {
        if (!this.dbPromise) {
            throw new Error('IndexedDB is not initialized')
        }
        return this.dbPromise
    }

    /**
     * 执行事务
     */
    private async withStore<T>(
        mode: IDBTransactionMode,
        callback: (store: IDBObjectStore) => IDBRequest<T>
    ): Promise<T> {
        const db = await this.getDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], mode)
            const store = transaction.objectStore(this.storeName)
            const request = callback(store)

            request.onsuccess = () => {
                resolve(request.result)
            }

            request.onerror = () => {
                reject(request.error)
            }
        })
    }

    async getItem<K extends keyof Schema>(key: K): Promise<Schema[K] | undefined> {
        try {
            const value = await this.withStore('readonly', (store) => store.get(String(key)))
            return value === undefined ? undefined : (value as Schema[K])
        } catch (error) {
            console.error(`Failed to get value for key: ${String(key)}`, error)
            return undefined
        }
    }

    async setItem<K extends keyof Schema>(key: K, value: Schema[K]): Promise<Schema[K]> {
        try {
            await this.withStore('readwrite', (store) => store.put(value, String(key)))
            return value
        } catch (error) {
            console.error(`Failed to set value for key: ${String(key)}`, error)
            throw error
        }
    }

    async removeItem<K extends keyof Schema>(key: K): Promise<void> {
        try {
            await this.withStore('readwrite', (store) => store.delete(String(key)))
        } catch (error) {
            console.error(`Failed to remove value for key: ${String(key)}`, error)
            throw error
        }
    }

    async clear(): Promise<void> {
        try {
            await this.withStore('readwrite', (store) => store.clear())
        } catch (error) {
            console.error('Failed to clear storage', error)
            throw error
        }
    }

    async length(): Promise<number> {
        try {
            return await this.withStore('readonly', (store) => store.count())
        } catch (error) {
            console.error('Failed to get storage length', error)
            return 0
        }
    }

    async key(n: number): Promise<keyof Schema | undefined> {
        try {
            const keys = await this.withStore('readonly', (store) => store.getAllKeys())
            return keys[n] as keyof Schema | undefined
        } catch (error) {
            console.error('Failed to get key', error)
            return undefined
        }
    }

    async keys(): Promise<(keyof Schema)[]> {
        try {
            const keys = await this.withStore('readonly', (store) => store.getAllKeys())
            return keys as (keyof Schema)[]
        } catch (error) {
            console.error('Failed to get all keys', error)
            return []
        }
    }

    async iterate(
        iteratee: <K extends keyof Schema>(value: Schema[K], key: K, iterationNumber: number) => void
    ): Promise<void> {
        try {
            const db = await this.getDB()
            const transaction = db.transaction([this.storeName], 'readonly')
            const store = transaction.objectStore(this.storeName)
            const request = store.openCursor()

            return new Promise((resolve, reject) => {
                let index = 0

                request.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
                    if (cursor) {
                        const key = cursor.key as keyof Schema
                        const value = cursor.value as Schema[keyof Schema]
                        iteratee(value, key, index)
                        index++
                        cursor.continue()
                    } else {
                        resolve()
                    }
                }

                request.onerror = () => {
                    reject(request.error)
                }
            })
        } catch (error) {
            console.error('Failed to iterate storage', error)
        }
    }
}
