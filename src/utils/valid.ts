import { METHODS_ARRAY } from '@/constants'
import type { Storage, AsyncStorage } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const isAsyncMethod = (fn: Function): boolean => {
    return fn.constructor.name === 'AsyncFunction'
}

/**
 * 验证存储对象的完整性和一致性，并判断是否为异步存储
 * @param storage 存储对象
 * @returns 如果是异步存储返回 true，同步存储返回 false
 * @throws 如果方法不存在或同步/异步类型不一致则抛出错误
 */
export function validateAndCheckConsistency(storage: Storage): storage is AsyncStorage {
    let isAsync: boolean | null = null // 用于跟踪同步/异步一致性

    // 遍历 METHODS_ARRAY 中的方法名
    METHODS_ARRAY.forEach((method) => {
        // 获取方法
        const methodFn = storage[method]

        // 如果该方法不存在，抛出错误
        if (typeof methodFn !== 'function') {
            throw new Error(`方法 ${method} 不存在或不是函数`)
        }

        // 判断该方法是否是异步方法
        const methodIsAsync = isAsyncMethod(methodFn)

        // 如果是第一次检查，设置 isAsync
        if (isAsync === null) {
            isAsync = methodIsAsync
        }

        // 检查同步异步是否一致
        if (isAsync !== methodIsAsync) {
            throw new Error(`方法 ${method} 的同步/异步类型与其他方法不一致`)
        }
    })

    return isAsync === true
}
