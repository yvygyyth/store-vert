import { describe, it, expect } from 'vitest'
import { capitalize } from '../src/utils/string'

/**
 * 字符串工具测试示例
 * 这个文件展示了如何编写测试用例
 */
describe('String Utils', () => {
    it('capitalize - should capitalize first letter', () => {
        expect(capitalize('hello')).toBe('Hello')
    })

    it('capitalize - should handle empty string', () => {
        expect(capitalize('')).toBe('')
    })
})
