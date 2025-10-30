import { describe, it, expect } from 'vitest'
import { unique } from '../src/utils/array'

/**
 * 数组工具测试示例
 * 这个文件展示了如何编写测试用例
 */
describe('Array Utils', () => {
    it('unique - should remove duplicates', () => {
        expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
    })

    it('unique - should handle empty array', () => {
        expect(unique([])).toEqual([])
    })
})
