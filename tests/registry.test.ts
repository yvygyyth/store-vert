import { describe, it, expect } from 'vitest'
import { inject, useStore } from '../src'

describe('Store Registry', () => {
    it('should inject and retrieve sync storage', () => {
        const mockStore = {
            getItem: (key: string) => `value-${key}`,
            setItem: (key: string, value: string) => {},
            removeItem: (key: string) => {},
            clear: () => {},
            length: () => 0,
            key: (n: number) => '',
            keys: () => [],
            iterate: (iteratee: any) => undefined
        }

        inject(mockStore, 'testSync')
        const storage = useStore('testSync')
        expect(storage).toBeDefined()
    })

    it('should inject and retrieve async storage', async () => {
        const mockAsyncStore = {
            getItem: async (key: string) => `value-${key}`,
            setItem: async (key: string, value: string) => {},
            removeItem: async (key: string) => {},
            clear: async () => {},
            length: async () => 0,
            key: async (n: number) => '',
            keys: async () => [],
            iterate: async (iteratee: any) => undefined
        }

        inject(mockAsyncStore, 'testAsync')
        const storage = useStore('testAsync')

        expect(storage).toBeDefined()
    })

    it('should throw error for non-existent storage', () => {
        expect(() => useStore('nonExistent')).toThrow('Store实例 nonExistent 未注册')
    })
})
