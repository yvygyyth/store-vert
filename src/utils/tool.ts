/**
 * 判断函数是否是 async function
 * @param fn 要判断的函数
 * @returns true 如果是 async function，否则 false
 */
export const isAsyncFunction = (fn: (...args: unknown[]) => unknown): boolean => {
    return fn && fn.constructor && fn.constructor.name === 'AsyncFunction'
}

/**
 * 判断一个值是否是 Promise
 * @param value 待判断的值
 * @returns true 如果是 Promise 或 thenable，否则 false
 */
export const isPromise = <T = unknown>(value: unknown): value is Promise<T> => {
    return (
        !!value &&
        (typeof value === 'object' || typeof value === 'function') &&
        typeof (value as { then?: unknown }).then === 'function'
    )
}

/**
 * 创建一个兼容 Node 环境的 Storage 对象
 * 在浏览器环境中返回真实的 Storage，在 Node 环境中返回一个模拟的空实现
 * @param storageGetter 获取真实 Storage 的函数，例如 () => window.localStorage
 * @returns Storage 对象
 */
export const createCompatibleStorage = (storageGetter: () => Storage): Storage => {
    if (typeof window !== 'undefined') {
        return storageGetter()
    }
    // Node 环境下的空实现
    return {
        getItem() {
            return null
        },
        setItem() {},
        removeItem() {},
        clear() {},
        key() {
            return null
        },
        get length() {
            return 0
        }
    }
}
