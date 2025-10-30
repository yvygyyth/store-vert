export type Store = {
    // 获取值
    getItem<T>(key: string): Promise<T | null> | T | null

    // 设置值
    setItem<T>(key: string, value: T): Promise<T> | T

    // 删除值
    removeItem(key: string): Promise<void> | void

    // 清空存储
    clear(): Promise<void> | void

    // 获取键数量
    length(): Promise<number> | number

    // 获取某个键
    key(n: number): Promise<string> | string

    // 获取所有键
    keys(): Promise<string[]> | string[]

    // 遍历所有数据
    iterate<T, R>(iteratee: (value: T, key: string, iterationNumber: number) => R): Promise<R> | R
}
