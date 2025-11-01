import { describe, it, expect } from 'vitest'
import { inject, useStorage } from '../src/registry'

describe('Storage Registry', () => {
    it('should inject and retrieve sync storage', () => {
        const mockStorage = {
            getItem: (key: string) => `value-${key}`,
            setItem: (key: string, value: string) => {},
            removeItem: (key: string) => {},
            clear: () => {},
            length: () => 0,
            key: (n: number) => '',
            keys: () => [],
            iterate: (iteratee: any) => undefined
        }

        inject(mockStorage, 'testSync')
        const storage = useStorage({ key: 'testSync' })
        expect(storage).toBeDefined()
    })

    it('should inject and retrieve async storage', async () => {
        const mockAsyncStorage = {
            getItem: async (key: string) => `value-${key}`,
            setItem: async (key: string, value: string) => {},
            removeItem: async (key: string) => {},
            clear: async () => {},
            length: async () => 0,
            key: async (n: number) => '',
            keys: async () => [],
            iterate: async (iteratee: any) => undefined
        }

        inject(mockAsyncStorage, 'testAsync')
        const storage = useStorage({ key: 'testAsync' })
        expect(storage).toBeDefined()
    })

    it('should throw error for non-existent storage', () => {
        expect(() => useStorage({ key: 'nonExistent' })).toThrow('Storage实例 nonExistent 未注册')
    })
})
