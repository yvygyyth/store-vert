import { describe, it, expect, beforeEach } from 'vitest'
import { createStore, STORAGE_KEYS, SyncEnhancedStore } from '../src'

describe('Memory Store', () => {
    type TestSchema = {
        name: string
        age: number
        email: string
        isAdmin: {
            role: string
            permissions: string[]
        }
    }

    const storage = createStore<TestSchema>(STORAGE_KEYS.memory)

    beforeEach(() => {
        // 每个测试前创建新的存储实例
        storage.clear()
    })

    it('应该正确设置和获取基本类型值', () => {
        storage.setItem('name', 'John')
        storage.setItem('age', 25)

        const name = storage.getItem('name')
        const age = storage.getItem('age')

        expect(name).toBe('John')
        expect(age).toBe(25)
    })

    it('应该正确设置和获取对象类型值', () => {
        const adminData = { role: 'admin', permissions: ['read', 'write', 'delete'] }
        storage.setItem('isAdmin', adminData)

        expect(storage.getItem('isAdmin')).toEqual(adminData)
    })

    it('获取不存在的键应该返回 undefined', () => {
        expect(storage.getItem('name')).toBeUndefined()
    })

    it('应该正确删除指定的键', () => {
        storage.setItem('name', 'John')
        storage.setItem('age', 25)

        storage.removeItem('name')

        expect(storage.getItem('name')).toBeUndefined()
        expect(storage.getItem('age')).toBe(25)
    })

    it('应该正确清空所有存储', () => {
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
        expect(storage.length()).toBe(0)

        storage.setItem('name', 'John')
        expect(storage.length()).toBe(1)

        storage.setItem('age', 25)
        expect(storage.length()).toBe(2)

        storage.removeItem('name')
        expect(storage.length()).toBe(1)
    })

    it('应该正确返回所有的键', () => {
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

        // 检查索引是否正确递增
        expect(items[0].index).toBe(0)
        expect(items[1].index).toBe(1)
        expect(items[2].index).toBe(2)
    })

    it('应该能够更新已存在的值', () => {
        storage.setItem('name', 'John')
        expect(storage.getItem('name')).toBe('John')

        storage.setItem('name', 'Jane')
        expect(storage.getItem('name')).toBe('Jane')
    })

    it('setItem 应该返回设置的值', () => {
        const result = storage.setItem('name', 'John')
        expect(result).toBe('John')

        const adminData = { role: 'admin', permissions: ['read'] }
        const result2 = storage.setItem('isAdmin', adminData)
        expect(result2).toEqual(adminData)
    })

    it('空的存储应该返回空的键数组', () => {
        expect(storage.keys()).toEqual([])
    })

    it('空的存储迭代不应该执行回调', () => {
        let callCount = 0
        storage.iterate(() => {
            callCount++
        })
        expect(callCount).toBe(0)
    })
})
