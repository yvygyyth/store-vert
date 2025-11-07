import { describe, it, expect, beforeEach } from 'vitest'
import { createStore, STORAGE_KEYS, AsyncEnhancedStore } from '../src'

describe('IndexedDB Store', () => {
    type TestSchema = {
        name: string
        age: number
        email: string
        isAdmin: {
            role: string
            permissions: string[]
        }
    }

    const storage = createStore<TestSchema>(STORAGE_KEYS.indexeddb, 'test-db', 'test-store')

    beforeEach(async () => {
        // 每个测试前创建新的存储实例并清空
        await storage.clear()
    })

    it('应该正确设置和获取基本类型值', async () => {
        await storage.setItem('name', 'John')
        await storage.setItem('age', 25)

        const name = await storage.getItem('name')
        const age = await storage.getItem('age')

        expect(name).toBe('John')
        expect(age).toBe(25)
    })

    it('应该正确设置和获取对象类型值', async () => {
        const adminData = { role: 'admin', permissions: ['read', 'write', 'delete'] }
        await storage.setItem('isAdmin', adminData)

        const result = await storage.getItem('isAdmin')
        expect(result).toEqual(adminData)
    })

    it('获取不存在的键应该返回 undefined', async () => {
        const result = await storage.getItem('name')
        expect(result).toBeUndefined()
    })

    it('应该正确删除指定的键', async () => {
        await storage.setItem('name', 'John')
        await storage.setItem('age', 25)

        await storage.removeItem('name')

        expect(await storage.getItem('name')).toBeUndefined()
        expect(await storage.getItem('age')).toBe(25)
    })

    it('应该正确清空所有存储', async () => {
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
        expect(await storage.length()).toBe(0)

        await storage.setItem('name', 'John')
        expect(await storage.length()).toBe(1)

        await storage.setItem('age', 25)
        expect(await storage.length()).toBe(2)

        await storage.removeItem('name')
        expect(await storage.length()).toBe(1)
    })

    it('应该正确返回所有的键', async () => {
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

    it('应该能够更新已存在的值', async () => {
        await storage.setItem('name', 'John')
        expect(await storage.getItem('name')).toBe('John')

        await storage.setItem('name', 'Jane')
        expect(await storage.getItem('name')).toBe('Jane')
    })

    it('setItem 应该返回设置的值', async () => {
        const result = await storage.setItem('name', 'John')
        expect(result).toBe('John')

        const adminData = { role: 'admin', permissions: ['read'] }
        const result2 = await storage.setItem('isAdmin', adminData)
        expect(result2).toEqual(adminData)
    })

    it('空的存储应该返回空的键数组', async () => {
        const keys = await storage.keys()
        expect(keys).toEqual([])
    })

    it('空的存储迭代不应该执行回调', async () => {
        let callCount = 0
        await storage.iterate(() => {
            callCount++
        })
        expect(callCount).toBe(0)
    })
})
