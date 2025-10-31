export const STORAGE_KEYS = {
    memory: 'memory',
    local: 'local',
    session: 'session',
    indexeddb: 'indexeddb'
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

export const METHODS = {
    getItem: 'getItem',
    setItem: 'setItem',
    removeItem: 'removeItem',
    clear: 'clear',
    length: 'length',
    key: 'key',
    keys: 'keys',
    iterate: 'iterate'
} as const

export const METHODS_ARRAY = Object.values(METHODS)

export type Method = (typeof METHODS)[keyof typeof METHODS]

export const STORAGE_TYPES = {
    async: 'async',
    sync: 'sync'
} as const

export type StorageType = (typeof STORAGE_TYPES)[keyof typeof STORAGE_TYPES]
