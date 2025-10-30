import { describe, it, expect } from 'vitest'
import { deepClone } from '../src/utils/object'

/**
 * 对象工具测试示例
 * 这个文件展示了如何编写测试用例
 */
describe('Object Utils', () => {
    it('deepClone - should deep clone object', () => {
        const original = { a: 1, b: { c: 2 } }
        const cloned = deepClone(original)

        cloned.b.c = 3
        expect(original.b.c).toBe(2)
        expect(cloned.b.c).toBe(3)
    })

    it('deepClone - should clone date', () => {
        const original = new Date('2024-01-01')
        const cloned = deepClone(original)

        expect(cloned.getTime()).toBe(original.getTime())
        expect(cloned).not.toBe(original)
    })
})
