// 基础工具：把一个函数变成异步版本
export type Asyncify<T extends (...args: never[]) => unknown> = (...args: Parameters<T>) => Promise<ReturnType<T>>

// 对象级工具：将对象中所有方法都 Asyncify
export type AsyncifyObject<T extends Record<string, (...args: never[]) => unknown>> = {
    [K in keyof T]: Asyncify<T[K]>
}
