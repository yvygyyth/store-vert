import { describe, it, expect, beforeEach } from 'vitest'
import { inject, useStore, createStore, SyncEnhancedStore, AsyncEnhancedStore } from '../src'
import type { SyncStore, AsyncStore, AnyRecord } from '../src/types'

describe('自定义模块注入测试', () => {
    type TestSchema = {
        name: string
        age: number
        email: string
        isAdmin: {
            role: string
            permissions: string[]
        }
    }

    // 自定义同步存储模块
    class CustomSyncStore<Schema extends AnyRecord = AnyRecord> implements SyncStore<Schema> {
        private store: Map<keyof Schema, Schema[keyof Schema]> = new Map()

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

    // 自定义异步存储模块
    class CustomAsyncStore<Schema extends AnyRecord = AnyRecord> implements AsyncStore<Schema> {
        private store: Map<keyof Schema, Schema[keyof Schema]> = new Map()

        async getItem<K extends keyof Schema>(key: K): Promise<Schema[K] | undefined> {
            // 模拟异步操作
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this.store.get(key) as Schema[K] | undefined)
                }, 10)
            })
        }

        async setItem<K extends keyof Schema>(key: K, value: Schema[K]): Promise<Schema[K]> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.store.set(key, value)
                    resolve(value)
                }, 10)
            })
        }

        async removeItem<K extends keyof Schema>(key: K): Promise<void> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.store.delete(key)
                    resolve()
                }, 10)
            })
        }

        async clear(): Promise<void> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.store.clear()
                    resolve()
                }, 10)
            })
        }

        async length(): Promise<number> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this.store.size)
                }, 10)
            })
        }

        async key(n: number): Promise<keyof Schema | undefined> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(Array.from(this.store.keys())[n] as keyof Schema | undefined)
                }, 10)
            })
        }

        async keys(): Promise<(keyof Schema)[]> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(Array.from(this.store.keys()))
                }, 10)
            })
        }

        async iterate(
            iteratee: <K extends keyof Schema>(value: Schema[K], key: K, iterationNumber: number) => void
        ): Promise<void> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let index = 0
                    for (const [key, value] of this.store.entries()) {
                        iteratee(value, key, index)
                        index++
                    }
                    resolve()
                }, 10)
            })
        }
    }

    describe('同步自定义模块注入和使用', () => {
        const CUSTOM_SYNC_KEY = 'customSync' as const

        beforeEach(() => {
            // 注册自定义同步存储模块
            inject(CustomSyncStore, CUSTOM_SYNC_KEY)
        })

        it('应该能够通过 useStore 获取已注册的自定义模块', () => {
            const storeFactory = useStore(CUSTOM_SYNC_KEY)
            expect(storeFactory).toBeDefined()
            expect(storeFactory).toBe(CustomSyncStore)
        })

        it('应该能够使用 createStore 创建自定义模块实例', () => {
            const storage = createStore<TestSchema>(CUSTOM_SYNC_KEY)
            expect(storage).toBeDefined()
            expect(storage.getItem).toBeDefined()
            expect(storage.setItem).toBeDefined()
        })

        it('应该正确设置和获取基本类型值', () => {
            const storage = createStore<TestSchema>(CUSTOM_SYNC_KEY) as SyncEnhancedStore<TestSchema>

            storage.setItem('name', 'John')
            storage.setItem('age', 25)

            const name = storage.getItem('name')
            const age = storage.getItem('age')

            expect(name).toBe('John')
            expect(age).toBe(25)
        })

        it('应该正确设置和获取对象类型值', () => {
            const storage = createStore<TestSchema>(CUSTOM_SYNC_KEY) as SyncEnhancedStore<TestSchema>
            const adminData = { role: 'admin', permissions: ['read', 'write', 'delete'] }

            storage.setItem('isAdmin', adminData)
            const result = storage.getItem('isAdmin')

            expect(result).toEqual(adminData)
        })

        it('应该正确删除指定的键', () => {
            const storage = createStore<TestSchema>(CUSTOM_SYNC_KEY) as SyncEnhancedStore<TestSchema>

            storage.setItem('name', 'John')
            storage.setItem('age', 25)
            storage.removeItem('name')

            expect(storage.getItem('name')).toBeUndefined()
            expect(storage.getItem('age')).toBe(25)
        })

        it('应该正确清空所有存储', () => {
            const storage = createStore<TestSchema>(CUSTOM_SYNC_KEY) as SyncEnhancedStore<TestSchema>

            storage.setItem('name', 'John')
            storage.setItem('age', 25)
            storage.setItem('email', 'john@example.com')
            storage.clear()

            expect(storage.getItem('name')).toBeUndefined()
            expect(storage.getItem('age')).toBeUndefined()
            expect(storage.getItem('email')).toBeUndefined()
            expect(storage.length()).toBe(0)
        })

        it('应该正确返回存储的长度', () => {
            const storage = createStore<TestSchema>(CUSTOM_SYNC_KEY) as SyncEnhancedStore<TestSchema>

            expect(storage.length()).toBe(0)
            storage.setItem('name', 'John')
            expect(storage.length()).toBe(1)
            storage.setItem('age', 25)
            expect(storage.length()).toBe(2)
            storage.removeItem('name')
            expect(storage.length()).toBe(1)
        })

        it('应该正确返回所有的键', () => {
            const storage = createStore<TestSchema>(CUSTOM_SYNC_KEY) as SyncEnhancedStore<TestSchema>

            storage.setItem('name', 'John')
            storage.setItem('age', 25)
            storage.setItem('email', 'john@example.com')

            const keys = storage.keys()

            expect(keys).toHaveLength(3)
            expect(keys).toContain('name')
            expect(keys).toContain('age')
            expect(keys).toContain('email')
        })

        it('应该正确迭代所有存储项', () => {
            const storage = createStore<TestSchema>(CUSTOM_SYNC_KEY) as SyncEnhancedStore<TestSchema>

            storage.setItem('name', 'John')
            storage.setItem('age', 25)
            storage.setItem('email', 'john@example.com')

            const items: Array<{ key: keyof TestSchema; value: any; index: number }> = []

            storage.iterate((value, key, index) => {
                items.push({ key, value, index })
            })

            expect(items).toHaveLength(3)
            expect(items.map((item) => item.key)).toContain('name')
            expect(items.map((item) => item.key)).toContain('age')
            expect(items.map((item) => item.key)).toContain('email')
        })
    })

    describe('异步自定义模块注入和使用', () => {
        const CUSTOM_ASYNC_KEY = 'customAsync' as const

        beforeEach(() => {
            // 注册自定义异步存储模块
            inject(CustomAsyncStore, CUSTOM_ASYNC_KEY)
        })

        it('应该能够通过 useStore 获取已注册的自定义异步模块', () => {
            const storeFactory = useStore(CUSTOM_ASYNC_KEY)
            expect(storeFactory).toBeDefined()
            expect(storeFactory).toBe(CustomAsyncStore)
        })

        it('应该能够使用 createStore 创建自定义异步模块实例', () => {
            const storage = createStore<TestSchema>(CUSTOM_ASYNC_KEY)
            expect(storage).toBeDefined()
            expect(storage.getItem).toBeDefined()
            expect(storage.setItem).toBeDefined()
        })

        it('应该正确设置和获取基本类型值', async () => {
            const storage = createStore<TestSchema>(CUSTOM_ASYNC_KEY) as AsyncEnhancedStore<TestSchema>

            await storage.setItem('name', 'John')
            await storage.setItem('age', 25)

            const name = await storage.getItem('name')
            const age = await storage.getItem('age')

            expect(name).toBe('John')
            expect(age).toBe(25)
        })

        it('应该正确设置和获取对象类型值', async () => {
            const storage = createStore<TestSchema>(CUSTOM_ASYNC_KEY) as AsyncEnhancedStore<TestSchema>
            const adminData = { role: 'admin', permissions: ['read', 'write', 'delete'] }

            await storage.setItem('isAdmin', adminData)
            const result = await storage.getItem('isAdmin')

            expect(result).toEqual(adminData)
        })

        it('应该正确删除指定的键', async () => {
            const storage = createStore<TestSchema>(CUSTOM_ASYNC_KEY) as AsyncEnhancedStore<TestSchema>

            await storage.setItem('name', 'John')
            await storage.setItem('age', 25)
            await storage.removeItem('name')

            expect(await storage.getItem('name')).toBeUndefined()
            expect(await storage.getItem('age')).toBe(25)
        })

        it('应该正确清空所有存储', async () => {
            const storage = createStore<TestSchema>(CUSTOM_ASYNC_KEY) as AsyncEnhancedStore<TestSchema>

            await storage.setItem('name', 'John')
            await storage.setItem('age', 25)
            await storage.setItem('email', 'john@example.com')
            await storage.clear()

            expect(await storage.getItem('name')).toBeUndefined()
            expect(await storage.getItem('age')).toBeUndefined()
            expect(await storage.getItem('email')).toBeUndefined()
            expect(await storage.length()).toBe(0)
        })

        it('应该正确返回存储的长度', async () => {
            const storage = createStore<TestSchema>(CUSTOM_ASYNC_KEY) as AsyncEnhancedStore<TestSchema>

            expect(await storage.length()).toBe(0)
            await storage.setItem('name', 'John')
            expect(await storage.length()).toBe(1)
            await storage.setItem('age', 25)
            expect(await storage.length()).toBe(2)
            await storage.removeItem('name')
            expect(await storage.length()).toBe(1)
        })

        it('应该正确返回所有的键', async () => {
            const storage = createStore<TestSchema>(CUSTOM_ASYNC_KEY) as AsyncEnhancedStore<TestSchema>

            await storage.setItem('name', 'John')
            await storage.setItem('age', 25)
            await storage.setItem('email', 'john@example.com')

            const keys = await storage.keys()

            expect(keys).toHaveLength(3)
            expect(keys).toContain('name')
            expect(keys).toContain('age')
            expect(keys).toContain('email')
        })

        it('应该正确迭代所有存储项', async () => {
            const storage = createStore<TestSchema>(CUSTOM_ASYNC_KEY) as AsyncEnhancedStore<TestSchema>

            await storage.setItem('name', 'John')
            await storage.setItem('age', 25)
            await storage.setItem('email', 'john@example.com')

            const items: Array<{ key: keyof TestSchema; value: any; index: number }> = []

            await storage.iterate((value, key, index) => {
                items.push({ key, value, index })
            })

            expect(items).toHaveLength(3)
            expect(items.map((item) => item.key)).toContain('name')
            expect(items.map((item) => item.key)).toContain('age')
            expect(items.map((item) => item.key)).toContain('email')
        })
    })

    describe('多个自定义模块共存', () => {
        const CUSTOM_SYNC_KEY_1 = 'customSync1' as const
        const CUSTOM_SYNC_KEY_2 = 'customSync2' as const

        beforeEach(() => {
            inject(CustomSyncStore, CUSTOM_SYNC_KEY_1)
            inject(CustomSyncStore, CUSTOM_SYNC_KEY_2)
        })

        it('应该能够注册和使用多个不同的自定义模块', () => {
            const storage1 = createStore<TestSchema>(CUSTOM_SYNC_KEY_1) as SyncEnhancedStore<TestSchema>
            const storage2 = createStore<TestSchema>(CUSTOM_SYNC_KEY_2) as SyncEnhancedStore<TestSchema>

            storage1.setItem('name', 'Storage1')
            storage2.setItem('name', 'Storage2')

            expect(storage1.getItem('name')).toBe('Storage1')
            expect(storage2.getItem('name')).toBe('Storage2')
            expect(storage1.getItem('name')).not.toBe(storage2.getItem('name'))
        })

        it('不同的自定义模块实例应该相互独立', () => {
            const storage1 = createStore<TestSchema>(CUSTOM_SYNC_KEY_1) as SyncEnhancedStore<TestSchema>
            const storage2 = createStore<TestSchema>(CUSTOM_SYNC_KEY_2) as SyncEnhancedStore<TestSchema>

            storage1.setItem('age', 25)
            storage2.setItem('age', 30)

            expect(storage1.getItem('age')).toBe(25)
            expect(storage2.getItem('age')).toBe(30)

            storage1.clear()
            expect(storage1.getItem('age')).toBeUndefined()
            expect(storage2.getItem('age')).toBe(30)
        })
    })

    describe('函数注入测试', () => {
        const ARROW_FUNCTION_KEY = 'arrowFunction' as const
        const NORMAL_FUNCTION_KEY = 'normalFunction' as const

        // 箭头函数存储工厂
        const ArrowFunctionStore = <Schema extends AnyRecord = AnyRecord>(): SyncStore<Schema> => {
            const store: Map<keyof Schema, Schema[keyof Schema]> = new Map()

            return {
                getItem<K extends keyof Schema>(key: K): Schema[K] | undefined {
                    return store.get(key) as Schema[K] | undefined
                },
                setItem<K extends keyof Schema>(key: K, value: Schema[K]): Schema[K] {
                    store.set(key, value)
                    return value
                },
                removeItem<K extends keyof Schema>(key: K): void {
                    store.delete(key)
                },
                clear(): void {
                    store.clear()
                },
                length(): number {
                    return store.size
                },
                key(n: number): keyof Schema | undefined {
                    return Array.from(store.keys())[n] as keyof Schema | undefined
                },
                keys(): (keyof Schema)[] {
                    return Array.from(store.keys())
                },
                iterate(
                    iteratee: <K extends keyof Schema>(value: Schema[K], key: K, iterationNumber: number) => void
                ): void {
                    let index = 0
                    for (const [key, value] of store.entries()) {
                        iteratee(value, key, index)
                        index++
                    }
                }
            }
        }

        // 普通函数存储工厂
        function NormalFunctionStore<Schema extends AnyRecord = AnyRecord>(): SyncStore<Schema> {
            const store: Map<keyof Schema, Schema[keyof Schema]> = new Map()

            return {
                getItem<K extends keyof Schema>(key: K): Schema[K] | undefined {
                    return store.get(key) as Schema[K] | undefined
                },
                setItem<K extends keyof Schema>(key: K, value: Schema[K]): Schema[K] {
                    store.set(key, value)
                    return value
                },
                removeItem<K extends keyof Schema>(key: K): void {
                    store.delete(key)
                },
                clear(): void {
                    store.clear()
                },
                length(): number {
                    return store.size
                },
                keys(): (keyof Schema)[] {
                    return Array.from(store.keys())
                },
                key(n: number): keyof Schema | undefined {
                    return Array.from(store.keys())[n] as keyof Schema | undefined
                },
                iterate(
                    iteratee: <K extends keyof Schema>(value: Schema[K], key: K, iterationNumber: number) => void
                ): void {
                    let index = 0
                    for (const [key, value] of store.entries()) {
                        iteratee(value, key, index)
                        index++
                    }
                }
            }
        }

        beforeEach(() => {
            inject(ArrowFunctionStore, ARROW_FUNCTION_KEY)
            inject(NormalFunctionStore, NORMAL_FUNCTION_KEY)
        })

        it('应该能够注入和使用箭头函数存储工厂', () => {
            const storage = createStore<TestSchema>(ARROW_FUNCTION_KEY) as SyncEnhancedStore<TestSchema>

            storage.setItem('name', 'ArrowFunction')
            const name = storage.getItem('name')

            expect(name).toBe('ArrowFunction')
        })

        it('应该能够注入和使用普通函数存储工厂', () => {
            const storage = createStore<TestSchema>(NORMAL_FUNCTION_KEY) as SyncEnhancedStore<TestSchema>

            storage.setItem('name', 'NormalFunction')
            const name = storage.getItem('name')

            expect(name).toBe('NormalFunction')
        })

        it('箭头函数存储工厂应该正确工作get方法', () => {
            const storage = createStore<TestSchema>(ARROW_FUNCTION_KEY) as SyncEnhancedStore<TestSchema>

            storage.setItem('name', 'John')
            storage.setItem('age', 25)
            storage.setItem('email', 'john@example.com')

            expect(storage.getItem('name')).toBe('John')
            expect(storage.getItem('age')).toBe(25)
            expect(storage.getItem('email')).toBe('john@example.com')
            expect(storage.getItem('notExist' as keyof TestSchema)).toBeUndefined()
        })

        it('普通函数存储工厂应该正确工作get方法', () => {
            const storage = createStore<TestSchema>(NORMAL_FUNCTION_KEY) as SyncEnhancedStore<TestSchema>

            storage.setItem('name', 'Jane')
            storage.setItem('age', 30)
            storage.setItem('email', 'jane@example.com')

            expect(storage.getItem('name')).toBe('Jane')
            expect(storage.getItem('age')).toBe(30)
            expect(storage.getItem('email')).toBe('jane@example.com')
            expect(storage.getItem('notExist' as keyof TestSchema)).toBeUndefined()
        })
    })
})
